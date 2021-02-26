#/bin/sh
export LC_ALL=C

#Export environment variable in 
APPENGINE_SDK=/Users/ericd/Applications/google-cloud-sdk/platform/google_appengine
ACCOUNTS_PATH=/Users/ericd/escloud/OnEsna/SEWebServer
export GOOGLE_APPENGINE_SDK_PATH=$APPENGINE_SDK/google
export PYTHONPATH=$APPENGINE_SDK/lib/django-1.9:$APPENGINE_SDK/lib/fancy_urllib:$APPENGINE_SDK:$ACCOUNTS_PATH:$ACCOUNTS_PATH/vendorlib
export HTTP_HOST=http://localhost:8080
export TZ=UTC

email_domain="ericloadtest.com"
user_pwd_file='./user-pwd.csv'
accounts_url='https://onesnastaging.esna.com'
spaces_url='https://loganstaging2020apis.esna.com'
usernumber=100000
if test -f "$user_pwd_file"; then
    echo "The user password file $user_pwd_file is exists."
else
    echo "The user password $user_pwd_file is not exists. create it with $usernumber users"
    for i in $(seq $usernumber $END); 
    do 
    username="user${i}@${email_domain}"
    password=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1)
    echo "$username,$password" >> $user_pwd_file
    done
fi

#Read the last line from the file user-jwt.csv
user_jwt_file='./user-jwts.csv'
last_rec=$( tail -n 1 $user_jwt_file)
status=$?
if [[ $status -eq 0 ]]; then
  echo "Get the last line ${last_rec}"
  user_idx=$(echo "$last_rec" | sed -E "s#user##g;s#@.*##g")
  echo "The user index is $user_idx"
  if ! [[ "$user_idx" =~ ^[0-9]+$ ]]; then
    beg_num=1
  else
    beg_num="$(($user_idx+1))"
  fi
else
  beg_num=1
fi
echo "begin number is $beg_num"


signup_users(){
  #parameter $1 is the string
  CMD="python $ACCOUNTS_PATH/socialenterprise/remote_data/accounts_cli.py users create --from_json=$1 --debug"
  echo $CMD
  cur_dir=$(pwd)
  cd $ACCOUNTS_PATH && $CMD && cd $cur_dir
}

signin_users(){
  #parameter $1 is the string
  local idx=0
  local jwt_token_idx_0=""
  while read line; do
    
    username=$(echo $line | sed -E "s#\[##g;s#\[##g;s#]##g;s#{##g;s#}##g;s#,\$##g;s#\"username\":\"##g;s#\"password\":##g;s#\",\".*##g")
    password=$(echo $line | sed -E "s#\[##g;s#\[##g;s#]##g;s#{##g;s#}##g;s#,\$##g;s#\"username\":\"##g;s#\"password\":##g;s#.*\",\"##g;s#\"\$##g")
    
    # Get jwt token 
    curl_result=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"auth_type\":\"native\",\"auth_provider\":\"onesna\",\"username\":\"$username\",\"password\":\"$password\"}" $accounts_url/api/1.0/jwt/get_jwt_token)
    echo $curl_result
    jwt_token=$(echo $curl_result | sed 's#\(.*\)\(\"token\":\"\)\([a-zA-Z0-9\._\-]*\)\(\".*\)#\3#')
    echo "Get the user $username with token $jwt_token"
    # Get user information from spaces. By this way the user's information will be sync to spaces.
    curl_result=$(curl -X GET -H "Authorization: jwt $jwt_token" $spaces_url/api/users/me)
    user_id=$(echo $curl_result | sed "s/\(.*\"_id\":\"\)\([a-fA-F0-9]*\)\(\".*\)/\2/g")
    echo "Get the user $username with _id $user_id"
    cur_tm=$(date +'%Y%m%d%H%M%S')
    if [[ $idx -eq 0 ]]; then
      #Create a topic
      echo "================= user $username create topic ======================"
      curl_result=$(curl -s -X POST -H "Authorization: jwt $jwt_token" -H "Content-Type: application/json" -d "{\"topic\":{\"title\":\"spaces $username $cur_tm\",\"type\":\"group\",\"id\":null},\"invitees\":[]}" $spaces_url/api/spaces/invite)
      topic_id=$(echo "$curl_result" |  sed "s#\(.*\"topicId\":\"\)\([a-zA-Z0-9]*\)\(\".*\)#\2#" )  
      echo "================= user $username created topic $topic_id ======================"
      jwt_token_idx_0=$jwt_token
      echo "$username,$topic_id,$jwt_token" >> user-jwts.csv
    else
      echo "================= user $username Join topic $topic_id ======================"
      set -x
      curl_result=$(curl -s -X POST -H "Authorization: jwt $jwt_token_idx_0" -H "Content-Type: application/json" -d "{\"role\":\"admin\"}" $spaces_url/api/topics/$topic_id/attendees/userId/$user_id)
      set +x
      echo "================= user $username Joined topic $topic_id ======================"
      echo "$username,$topic_id,$jwt_token" >> user-jwts.csv
    fi
    idx="$(($idx+1))"

  done <<< $1
}

upload_json_string=""
batch_size=50
batch_idx=0
#Read user-pwd.csv from line $beg_num
sed -n "$beg_num"',$p' $user_pwd_file |
while read line; do
  echo $line
  IFS=','
  read -ra strarr <<< "$line"
  IFS=' '
  username="${strarr[0]}"
  password="${strarr[1]}"
  if [[ -z $upload_json_string ]]; then
    upload_json_string="{\"username\":\"${username}\",\"password\":\"${password}\"}"
  else
    upload_json_string="${upload_json_string},"$'\n'"{\"username\":\"${username}\",\"password\":\"${password}\"}"
  fi
  batch_idx=$(($batch_idx + 1))
  if [[ "$batch_idx" -ge "$batch_size" ]]; then
    upload_json_string="[$upload_json_string]"
    echo $upload_json_string
    signup_users "$upload_json_string"
    signin_users "$upload_json_string"
    batch_idx=0
    upload_json_string=""
    # exit 1
  fi 
done