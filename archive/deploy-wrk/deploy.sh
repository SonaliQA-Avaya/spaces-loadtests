#!/bin/bash

# Automate wrk/k8s load test based on
#   https://cloud.google.com/solutions/distributed-load-testing-using-kubernetes
# Tiefeng Jia <jackj@esna.com>
# Sept 2017

# usage function
usage()
{
    echo "Usage: deploy.sh [PARAMETERS] [PATHS_FILE]"
    echo
    echo "[PATHS_FILE]                 Test paths yaml file, optional, default is ../restapi/paths.yaml"
    echo
    echo "PARAMETERS"
    echo "  -p | --project             Google Cloud project name, required"
    echo "  -c | --cluster             Google Cloud cluster name, default is loadtest-wrk"
    echo "  -s | --size                Google Cloud cluster size, default is 3"
    echo "  -m | --machine             Google Cloud machine type, default is n1-standard-1"
    echo "  -z | --zone                Google Cloud zone, default is us-central1-a"
    echo "  -t | --tag                 Registry tag, default is current timestamp"
    echo "  -o | --macro               Micro YAML file, optional"
    echo "  -h                         Display help"
}

realpath() {
  [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}

# variables
PATHS_FILE=../restapi/paths.yaml
MACROS_YAML=
LUA_SCRIPT=../restapi/multiple-paths.lua
PATH_HEALTH_YAML=../restapi/health.yaml
GCE_PROJECT=onesnastaging
GCE_CLUSTER=loadtest-wrk
GCE_CLUSTER_SIZE=3
GCE_MACHINE=n1-standard-1
GCE_ZONE=us-central1-a
GCE_TAG=

# current script name/path
SCRIPT=$0
if [[ "$SCRIPT" != /* ]]; then
  SCRIPT="$PWD/${SCRIPT#./}"
fi
SCRIPTPATH=$(dirname "$SCRIPT")

# load command parameters
while [ "$1" != "" ]; do
    case $1 in
        -p | --project )        shift
                                GCE_PROJECT=$1
                                ;;
        -c | --cluster )        shift
                                GCE_CLUSTER=$1
                                ;;
        -s | --size )           shift
                                GCE_CLUSTER_SIZE=$1
                                ;;
        -m | --machine )        shift
                                GCE_MACHINE=$1
                                ;;
        -z | --zone )           shift
                                GCE_ZONE=$1
                                ;;
        -t | --tag )            shift
                                GCE_TAG=$1
                                ;;
        -o | --macro )          shift
                                MACROS_YAML=$1
                                ;;
        -h | --help )           usage
                                exit
                                ;;
        * )                     PATHS_FILE=$1
                                ;;
    esac
    shift
done

# validate parameters
ERROR=
[ -z "$GCE_PROJECT" ] && ERROR="project name is required."
[ -n "$ERROR" ] && echo "Error: $ERROR" && exit 1

if [ -f "$PATHS_FILE" ]; then
  [[ "$PATHS_FILE" != *.yaml ]] && ERROR="paths file "\""$PATHS_FILE"\"" is not a yaml file."
  [ -n "$ERROR" ] && echo "Error: $ERROR" && exit 1
fi
if [ -f "$MACROS_YAML" ]; then
  [[ "$MACROS_YAML" != *.yaml ]] && ERROR="macro file "\""$MACROS_YAML"\"" is not a yaml file."
  [ -n "$ERROR" ] && echo "Error: $ERROR" && exit 1
fi

if [ -z "$GCE_TAG" ]; then
  PATHS_NAME=
  if [ -f "$PATHS_FILE" ]; then
    PATHS_NAME=$(basename "$PATHS_FILE" | sed "s/.yaml$//")
  fi
  TIMESTAMP=$(date +%Y%m%d%H%M)
  if [ -z "$PATHS_NAME" ]; then
    REGISTRY_TAG="${TIMESTAMP}"
  else
    REGISTRY_TAG="${PATHS_NAME}-${TIMESTAMP}"
  fi
else
  REGISTRY_TAG="$GCE_TAG"
fi

# confirmation message
echo "======================================================"
echo "Will prepare wrk testing machines on:"
echo "  Project:    $GCE_PROJECT"
echo "  Zone:       $GCE_ZONE"
echo "  Cluster:    $GCE_CLUSTER"
echo "  Machine:    $GCE_MACHINE"
echo "  Size:       $GCE_CLUSTER_SIZE"
echo "  Tag:        $REGISTRY_TAG"
echo
CONFIRM=
read -p "Is the above information correct? (input yes to continue) " CONFIRM
[ "$CONFIRM" != "yes" ] && echo "exit" && exit

# make sure configurations
# gcloud config set project "$GCE_PROJECT"
# gcloud config set compute/zone "$GCE_ZONE"

# check cluster existence
DOES_CLUSTER_EXISTS=$(gcloud container clusters list --project "$GCE_PROJECT" --zone "$GCE_ZONE" --format="get(name)" | grep "$GCE_CLUSTER")
if [ -n "$DOES_CLUSTER_EXISTS" ]; then
  echo ">>> Cluster "\""$GCE_CLUSTER"\"" is already existed"
  EXISTED_CLUSTER_SIZE=$(gcloud container clusters describe "$GCE_CLUSTER" --project "$GCE_PROJECT" --zone "$GCE_ZONE" --format="value(currentNodeCount)")
  if [ "$EXISTED_CLUSTER_SIZE" != "$GCE_CLUSTER_SIZE" ]; then
    echo "    current cluster size is $EXISTED_CLUSTER_SIZE, resizing..."
    gcloud container clusters resize "$GCE_CLUSTER" --size $GCE_CLUSTER_SIZE --project "$GCE_PROJECT" --zone "$GCE_ZONE" --quiet
    echo "    please wait to verify changes, this may take about 1 minute..."
    sleep 50

    # verify resize status
    COUNT=0
    MAX_COUNT=50
    while [ $COUNT -lt $MAX_COUNT ]
    do
      EXISTED_CLUSTER_SIZE=$(gcloud container clusters describe "$GCE_CLUSTER" --project "$GCE_PROJECT" --zone "$GCE_ZONE" --format="value(currentNodeCount)")
      echo "  verifying (expected $GCE_CLUSTER_SIZE, current $EXISTED_CLUSTER_SIZE) ..."
      if [ "$EXISTED_CLUSTER_SIZE" != "$GCE_CLUSTER_SIZE" ]; then
        COUNT=`expr $COUNT + 1`
        sleep 2
      else
        break
      fi
    done
    if [ $COUNT -eq $MAX_COUNT ]; then
      echo "   cluster is not resized properly, please verify from console and try again."
      echo "   command: gcloud container clusters describe "\""$GCE_CLUSTER"\"" --project "\""$GCE_PROJECT"\"" --zone "\""$GCE_ZONE"\"" --format="\""value(currentNodeCount)"\"
      echo "EXIT"
      exit 1
    fi
  fi
  gcloud container clusters describe "$GCE_CLUSTER" --project "$GCE_PROJECT" --zone "$GCE_ZONE" --format="table[box](name,zone,status,endpoint,clusterIpv4Cidr,servicesIpv4Cidr,currentNodeCount,nodeConfig.machineType)"
  CONFIRM=
  read -p "Is the above configuration correct? (input yes to continue) " CONFIRM
  [ "$CONFIRM" != "yes" ] && echo "EXIT" && exit
else
  echo "    Cluster doesn't exist, creating..."
  gcloud container clusters create "$GCE_CLUSTER" --project "$GCE_PROJECT" --zone "$GCE_ZONE" --machine-type "$GCE_MACHINE" --disk-size "20" --num-nodes "$GCE_CLUSTER_SIZE" --enable-cloud-logging --enable-cloud-monitoring
fi

# init kubectl
gcloud container clusters get-credentials "$GCE_CLUSTER" --project "$GCE_PROJECT" --zone "$GCE_ZONE"
echo "======================================================"
K8S_CONTEXT=$(kubectl config current-context)
if [ "$K8S_CONTEXT" != "gke_${GCE_PROJECT}_${GCE_ZONE}_${GCE_CLUSTER}" ]; then
  echo ">>> kubectl context is not set correctly."
  echo "    current context is $K8S_CONTEXT."
  echo "EXIT"
  exit 1
else
  echo ">>> kubectl connected with context $K8S_CONTEXT"
fi

# prepare docker
echo "======================================================"
echo ">>> building docker image..."
rm "$SCRIPTPATH/docker-image/*.lua"
cp "$LUA_SCRIPT" "$SCRIPTPATH/docker-image/"
if [ -f "$PATHS_FILE" ]; then
  cp "$PATHS_FILE" "$SCRIPTPATH/docker-image/"
fi
if [ -f "$MACROS_YAML" ]; then
  cp "$MACROS_YAML" "$SCRIPTPATH/docker-image/"
fi
cp "$PATH_HEALTH_YAML" "$SCRIPTPATH/docker-image/"
docker build -t "gcr.io/$GCE_PROJECT/wrk-workers" "$SCRIPTPATH/docker-image"

# upload docker
echo "======================================================"
echo ">>> pushing docker image..."
gcloud docker --project "$GCE_PROJECT" -- push "gcr.io/$GCE_PROJECT/wrk-workers"

gcloud beta container images add-tag "gcr.io/$GCE_PROJECT/wrk-workers" "gcr.io/$GCE_PROJECT/wrk-workers:$REGISTRY_TAG" --project "$GCE_PROJECT" --quiet

# update k8s config files
echo "======================================================"
echo ">>> preparing kubernetes config files..."
cat "$SCRIPTPATH/kubernetes-config/wrk-worker-controller.tpl.yaml" | sed "s/GCE_PROJECT/${GCE_PROJECT}/g" | sed "s/GCE_CLUSTER_SIZE/${GCE_CLUSTER_SIZE}/g" > "$SCRIPTPATH/kubernetes-config/wrk-worker-controller.yaml"

echo "======================================================"
echo ">>> deploying worker..."
K8S_EXISTS=$(kubectl describe rc/wrk-worker)
if [ -n "$K8S_EXISTS" ]; then
  echo "    deleting existing worker..."
  kubectl delete rc/wrk-worker
fi
echo "    creating worker..."
kubectl create -f "$SCRIPTPATH/kubernetes-config/wrk-worker-controller.yaml"

echo "DONE"
exit 0
