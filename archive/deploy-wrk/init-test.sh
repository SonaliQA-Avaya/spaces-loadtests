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
    echo "  -s | --spaces              Avaya Spaces URL, required if no -e provided"
    echo "  -h                         Display help"
}

INIT_ENV=
ACCOUNTS_URL=
SPACES_URL=
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
        ;;
    "staging")
        if [ -z "$ACCOUNTS_URL" ]; then
            ACCOUNTS_URL=https://onesnastaging.esna.com
        fi
        if [ -z "$SPACES_URL" ]; then
            SPACES_URL=https://loganstaging.esna.com
        fi
        ;;
    "testing")
        if [ -z "$ACCOUNTS_URL" ]; then
            ACCOUNTS_URL=https://onesnatesting.esna.com
        fi
        if [ -z "$SPACES_URL" ]; then
            SPACES_URL=https://logantesting.esna.com
        fi
        ;;
esac

[ -z "$ACCOUNTS_URL" ] && echo "Error: cannot find Zang Account URL" && echo && usage && exit 1
[ -z "$SPACES_URL" ] && echo "Error: cannot find Avaya Spaces URL" && echo && usage && exit 1

echo "Will connect these services to generate test case files:"
echo "  Accounts: $ACCOUNTS_URL"
echo "  Spaces  : $SPACES_URL"

TEMPLATE_DIR=../restapi/
TEMPLATE_FILES=("macros.tpl.yaml")
DESTINATION_DIR=docker-image/

echo
echo "Please provide your Zang Accounts ($ACCOUNTS_URL) login information:"

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
echo ">>> Trying to get $SPACES_URL/api/users/me/settings"
SETTING_ID=$(curl -s -H "Authorization: jwt $JWTTOKEN" "$SPACES_URL/api/users/me/settings" | python -c "import sys, json; print json.load(sys.stdin)['data'][0]['_id']")
echo "<<< User ID: $SETTING_ID"

echo
echo ">>> Trying to get $SPACES_URL/api/users/me/spaces"
SPACES=$(curl -s -H "Authorization: jwt $JWTTOKEN" "$SPACES_URL/api/users/me/spaces" | python -c "exec(\"import sys, json;\nresult = json.load(sys.stdin);\nfor space in result['data']:\n  print space['_id']\")")
SPACE_ID=
MESSAGE_ID=
for space in $SPACES; do
  echo "  >>> Trying to get $SPACES_URL/api/topics/$space/ideas?size=10"
  FIRST_IDEA=$(curl -s -H "Authorization: jwt $JWTTOKEN" "$SPACES_URL/api/topics/$space/ideas?size=10" | python -c "import sys, json; result = json.load(sys.stdin); print (result['data'][0]['_id'] if result['data'] and result['data'][0] else None)")
  if [ -n "$FIRST_IDEA" ]; then
    SPACE_ID=$space
    MESSAGE_ID=$FIRST_IDEA
    break
  fi
done
[ -z "$MESSAGE_ID" ] && echo "Error: no spaces found have messages." && exit 1
echo "<<< Find one space $SPACE_ID with idea: $MESSAGE_ID"

echo
for tpl in ${TEMPLATE_FILES[@]}; do
    file=$(echo $tpl | sed 's/\.tpl//')
    echo ">>> Saving $DESTINATION_DIR$file"
    sed "s/{JWTTOKEN}/$JWTTOKEN/g;s/{USER_ID}/$USER_ID/g;s/{SETTING_ID}/$SETTING_ID/g;s/{SPACE_ID}/$SPACE_ID/g;s/{MESSAGE_ID}/$MESSAGE_ID/g" "$TEMPLATE_DIR$tpl" > "$DESTINATION_DIR$file"
done
