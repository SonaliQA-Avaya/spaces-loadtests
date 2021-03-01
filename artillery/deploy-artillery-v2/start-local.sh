#!/bin/bash

file=""

while [ "$1" != "" ]; do
  case $1 in
    -f | --file ) shift
                  file=$1
                  ;;
    -h | --help) need_help=true
                 break
                 ;;
  esac
  shift
done

if [ "$need_help" = true ]; then
  echo "Options:"
  echo ""
  echo "-h, --help      output usage information"
  echo "-f, --file      The artillery file will be executed"
  exit
fi

if [[ -z "$file" ]]; then
  echo "Must set the file to be executed"
  exit 1
fi

# Remove the file's plugin
echo "==================  Remove pluing part ============================="
CMD="cat ${file} | sed -n '/BEGIN_NONE_LOCA/,/END_NONE_LOCAL/!p' > ${file}.local"
echo $CMD
cat ${file} | sed -n '/BEGIN_NONE_LOCA/,/END_NONE_LOCAL/!p' > ${file}.local

echo "==================  Start run script ============================="
CMD="../bin/artillery run ${file}.local"
echo $CMD
../bin/artillery run ${file}.local
