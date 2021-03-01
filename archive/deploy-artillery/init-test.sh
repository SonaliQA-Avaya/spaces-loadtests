#!/bin/bash

# Init test case by prompting login information
#
# Tiefeng Jia <jackj@esna.com>
# Dec 2017

# usage function
usage()
{
    echo "Usage: init-test.sh [PARAMETERS]"
    echo
    echo "PARAMETERS"
    echo "  -e | --env                 Environment, could be production, staging, or testing"
    echo "  -a | --accounts            Zang Accounts URL, required if no -e provided"
    echo "  -s | --spaces              Avaya Spaces Frontend URL, required if no -e provided"
    echo "  -k | --socket              Avaya Spaces Socket URL, required if no -e provided"
    echo "  -h                         Display help"
}

INIT_ENV=
ACCOUNTS_URL=
SPACES_URL=
SPACES_SOCKET_URL=
# load command parameters
while [ "$1" != "" ]; do
    case $1 in
        -e | --env )            shift
                                INIT_ENV=$1
                                ;;
        -a | --accounts )       shift
                                ACCOUNTS_URL=$1
                                ;;
        -s | --spaces )         shift
                                SPACES_URL=$1
                                ;;
        -k | --socket )         shift
                                SPACES_SOCKET_URL=$1
                                ;;
        -h | --help )           usage
                                exit
                                ;;
        * )                     INIT_ENV=$1
                                ;;
    esac
    shift
done

case "$INIT_ENV" in
    "production")
        if [ -z "$ACCOUNTS_URL" ]; then
            ACCOUNTS_URL=https://accounts.zang.io
        fi
        if [ -z "$SPACES_URL" ]; then
            SPACES_URL=https://spaces.zang.io
        fi
        if [ -z "$SPACES_SOCKET_URL" ]; then
            SPACES_SOCKET_URL=https://spacesapis-socket.zang.io
        fi
        ;;
    "staging")
        if [ -z "$ACCOUNTS_URL" ]; then
            ACCOUNTS_URL=https://onesnastaging.esna.com
        fi
        if [ -z "$SPACES_URL" ]; then
            SPACES_URL=https://loganstaging.esna.com
        fi
        if [ -z "$SPACES_SOCKET_URL" ]; then
            SPACES_SOCKET_URL=https://loganstagingapis-socket.esna.com
        fi
        ;;
    "testing")
        if [ -z "$ACCOUNTS_URL" ]; then
            ACCOUNTS_URL=https://onesnatesting.esna.com
        fi
        if [ -z "$SPACES_URL" ]; then
            SPACES_URL=https://logantesting.esna.com
        fi
        if [ -z "$SPACES_SOCKET_URL" ]; then
            SPACES_SOCKET_URL=https://logantestingapis-socket.esna.com
        fi
        ;;
esac

[ -z "$ACCOUNTS_URL" ] && echo "Error: cannot find Zang Account URL" && echo && usage && exit 1
[ -z "$SPACES_URL" ] && echo "Error: cannot find Avaya Spaces Frontend URL" && echo && usage && exit 1
[ -z "$SPACES_SOCKET_URL" ] && echo "Error: cannot find Avaya Spaces Socket URL" && echo && usage && exit 1

echo "Will connect these services to generate test case files:"
echo "  Accounts: $ACCOUNTS_URL"
echo "  Spaces  : $SPACES_URL"
echo "  Socket  : $SPACES_SOCKET_URL"

TEMPLATE_DIR=../socketio/
TEMPLATE_FILES=("connection.tpl.yaml" "message.tpl.yaml")
DESTINATION_DIR=docker-image/

echo
echo "Please provide your Zang Accounts ($ACCOUNTS_URL) login information:"

USERNAME=
PASSWORD=
read -p "  Username: " USERNAME
[ -z "$USERNAME" ] && echo "Error: username is required" && exit 1
read -s -p "  Password: " PASSWORD
[ -z "$PASSWORD" ] && echo "Error: password is required" && exit 1
echo

echo
echo ">>> Trying to login at $ACCOUNTS_URL/account/login ..."

# This is the response of login page/form
# <div style='display:none'><input type='hidden' name='csrfmiddlewaretoken' value='Y5yfMwyKoL9K1EVdfxwxxPr5lNvhssQ8' /></div>
CSRFTOKEN=$(curl -s "$ACCOUNTS_URL/account/login" | grep csrfmiddlewaretoken | grep -o "value=[^ ]*" | sed 's/"//g' | sed "s/'//g" | awk -F'=' '{ print $2 }')
[ -z "$CSRFTOKEN" ] && echo "Error: failed to get CSRF token" && exit 1

LOGINRESPONSE=$(curl -s -i -X POST \
    -F "csrfmiddlewaretoken=$CSRFTOKEN" \
    -F "username=$USERNAME" \
    -F "password=$PASSWORD" \
    --referer "$ACCOUNTS_URL/account/login" \
    --cookie "csrftoken=$CSRFTOKEN" \
    "$ACCOUNTS_URL/account/login")
INVALID_LOGIN=$(echo $LOGINRESPONSE | grep "Invalid Username or Password!")
[ -n "$INVALID_LOGIN" ] && echo "Error: invalid username or password" && exit 1
JWTTOKEN=$(echo $LOGINRESPONSE | grep -o "AUTH_TOKEN=[^ ;]*" | awk -F'=' '{ print $2 }')
[ -z "$JWTTOKEN" ] && echo "Error: failed to get JWT token" && exit 1
echo "<<< Login successfully, received token:" $JWTTOKEN

echo
echo ">>> Trying to get $SPACES_URL/api/users/me"
USER_ID=$(curl -s -H "Authorization: jwt $JWTTOKEN" "$SPACES_URL/api/users/me" | python -c "import sys, json; print json.load(sys.stdin)['_id']")
echo "<<< User ID: $USER_ID"

echo
echo ">>> Trying to get $SPACES_URL/api/users/me/spaces"
read -r -d '' PYTHON_SNIPPET_GETNEXT << EOSNP1
import sys, json

result = json.load(sys.stdin);

if 'nextPageUrl' in result:
    print(result['nextPageUrl'])

EOSNP1
read -r -d '' PYTHON_SNIPPET_GETIDS << EOSNP2
import sys, json

result = json.load(sys.stdin);

topic_ids = []
if result['data']:
    for topic in result['data']:
        topic_ids.append('"' + topic['_id'] + '"')

print(', '.join(topic_ids))

EOSNP2
API_URL="$SPACES_URL/api/users/me/spaces"
SPACE_IDS=
while [ -n "$API_URL" ]
do
  echo "  > $API_URL"
  API_RESULT=$(curl -s -H "Authorization: jwt $JWTTOKEN" "$API_URL")
  API_NEXT_URL=$(echo "$API_RESULT" | python -c "$PYTHON_SNIPPET_GETNEXT")
  if [ -n "$API_NEXT_URL" ]; then
    API_URL="$SPACES_URL$API_NEXT_URL"
  else
    API_URL=
  fi
  SPACE_IDS_SUBSET=$(echo "$API_RESULT" | python -c "$PYTHON_SNIPPET_GETIDS")
  echo "  < $SPACE_IDS_SUBSET"
  if [ -z "$SPACE_IDS_SUBSET" ]; then
    # no data found in result, stop loop
    API_URL=
  fi
  if [ -n "$SPACE_IDS_SUBSET" ]; then
    if [ -n "$SPACE_IDS" ]; then
      SPACE_IDS="$SPACE_IDS, "
    fi
    SPACE_IDS="$SPACE_IDS$SPACE_IDS_SUBSET"
  fi
done
[ -z "$SPACE_IDS" ] && echo "Error: no spaces found in the user account" && exit 1
echo "<<< Find space IDs: $SPACE_IDS"
echo "$SPACE_IDS"

echo
for tpl in ${TEMPLATE_FILES[@]}; do
    file=$(echo $tpl | sed 's/\.tpl//')
    echo ">>> Saving $DESTINATION_DIR$file"
    sed "s/{JWTTOKEN}/$JWTTOKEN/g;s/{USER_ID}/$USER_ID/g;s/{SPACE_IDS}/$SPACE_IDS/g;s#{TEST_URL}#$SPACES_SOCKET_URL#g" "$TEMPLATE_DIR$tpl" > "$DESTINATION_DIR$file"
done
