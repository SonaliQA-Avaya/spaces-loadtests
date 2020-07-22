#!/bin/bash

cleanup ()
{
  kill -s SIGTERM $!
  exit 0
}

trap cleanup SIGINT SIGTERM

#We can set environment variable ARTILLERYEXE to set artillery execute file path.
artillery_exe="artillery"
if [[ -z "ARTILLERYEXE" ]]; then
  artillery_exe=${ARTILLERYEXE}
fi

#Start running a artillery file
#The artillery file is under the environemnt variable ARTILLERYFILE
if [[ -z "ARTILLERYFILE" ]]; then
  echo "There is no artillery file defined in environment variable ARTILLERYFILE"
else
  CMD="$artillery_exe run ${ARTILLERYFILE}"
  echo $CMD
  $CMD
fi

echo "Finish run the command $artillery_exe . Now entered the endless loop."
while [ 1 ]
do
  sleep 60 &
    wait $!
done
