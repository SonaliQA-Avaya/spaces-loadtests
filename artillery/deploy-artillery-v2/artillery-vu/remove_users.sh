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
usernumber=2
for i in $(seq $usernumber $END); 
do 
    username="user${i}@${email_domain}"
    $(python $ACCOUNTS_PATH/socialenterprise/remote_data/accounts_cli.py users delete $username) 
done