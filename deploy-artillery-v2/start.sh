#!/bin/bash

gcp_project="onesnastaging"
cluster_name="artillery-vu"
zone="us-central1-a"
directory=""

while [ "$1" != "" ]; do
  case $1 in
    # -p | --project ) shift
    #               gcp_project=$1
    #               ;;
    # -c | --cluster) shift
    #               cluster_name=$1
    #               ;;
    # -z | --zone) shift
    #              zone=$1
    #              ;;
    -d | --directory) shift
                 directory=$1
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
  # echo "-p, --project   The project name in gcp, default value is onesnastaging"
  # echo "-c, --cluster   The cluster name of kubernetes, default value is artillery-vu"
  # echo "-z, --zone      THe zone of the the cluster, default value is us-central1-a"
  echo "-d, --directory The directory of the files will be executed in kubernetes."
  exit
fi

if [[ -z "$directory" ]]; then
  echo "Must set directory of the files will be deployed to kubernetes"
  exit 1
else
  #Remove the last "/" at the end of string
  directory=$(echo "$directory" | sed -E "s#/+\$##g")
  echo "Will deploy the directory ${directory} to the cluster"  
fi

{ read gcp_project; read cluster_name; read zone;} < ~/.esArtillery.config

echo "GCP Project= $gcp_project"
echo "Cluster=     $cluster_name" 
echo "zone=        $zone"
echo "director=     $directory"

read -p "Are you sure (Y/n)? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  : ;
else
  exit 
fi


#Connect to the cluster
echo "====================    Connect to the cluster now    ======================="
CMD="gcloud container clusters get-credentials $cluster_name --zone=$zone --project=$gcp_project"
echo $CMD
$CMD
status=$?
if [[ $status -eq 0 ]]; then
  echo "Connect to the cluster $cluster_name successfully!"
else
  echo "Create to the cluster $cluster_name failed!"
  exit 1
fi

#Remove existed installed daemonset
echo "====================    Remove existed installed daemonset   ======================="
CMD="kubectl get daemonset"
echo $CMD
CMD_RESULT=$($CMD)
status=$?
if [[ $status -eq 0 ]]; then
  line_idx=0
  while read -r line
  do
    if [[ $line_idx -gt 0 ]]; then
      daemonset_name=$(echo "$line" | sed -E 's# +.*##g')
      CMD="kubectl delete daemonset ${daemonset_name}"
      echo $CMD
      $($CMD)
      status=$?
      if [[ $status -eq 0 ]]; then
        echo "Delete the daemonset ${daemonset_name} successfully"
      else 
        echo "Delete the daemonset ${daemonset_name} failed"
      fi
    fi
    line_idx=$(($line_idx + 1))
  done <<< "$CMD_RESULT"
else
  echo "There is no daemonset installed yet."
fi

#Create secret by files in the directory
echo "===================  Create secret by files in the directory ===================="
secret_file_string=""
has_processed_yaml=false
for file in ${directory}/*; do
  pure_file=$(echo "${file}" | sed -E "s#${directory}/##g")
  echo "${pure_file}"
  if [[ $pure_file && "$pure_file" != "*" ]]; then
    # Change yaml file to "artillery-main.yaml" to make sure the entry of script is artillery-main.yaml
    if [[ "$pure_file" == *.yaml ]]; then
      if [[ "$has_processed_yaml" = true ]]; then
        echo "There should be only one artillery yaml file in the diretory!"
        exit 1
      fi
      secret_file_string="$secret_file_string --from-file=artillery-main.yaml=${file}"
      has_processed_yaml=true
    else 
      secret_file_string="$secret_file_string --from-file=${pure_file}=${file}"
    fi;
  fi
done
if [[ -z "$has_processed_yaml" ]]; then
   echo "The directory ${directory} has no yaml file, it is not a test case folder"
   exit 1
fi
if [[ $secret_file_string ]]; then
  CMD="kubectl create secret generic artillery-case ${secret_file_string} --dry-run -o yaml |  kubectl apply -f -"
  echo "$CMD"
  kubectl create secret generic artillery-case ${secret_file_string} --dry-run -o yaml |  kubectl apply -f -
  status=$?
  if [[ $status -eq 0 ]]; then
    echo "Upload files to daemonset successfully"
  else
    echo "Upload files to daemonset failed"
    exit 1
  fi
fi

#Change configuration file with timestamp
echo " ======================   Change configuration map of es-artillery-config ================"
cur_tm=$(date +'%Y%m%d%H%M%S')
CMD_RESULT=$(cat ./k8s/artillery-configmap.yaml | sed -E "s#(DD_PREFIX: .*)#\1_${cur_tm}.#g; s#(DD_EVT_TITLE: .*)#\1_${cur_tm}#g")
echo "${CMD_RESULT} | kubectl apply -f - "
echo "${CMD_RESULT}" | kubectl apply -f -
status=$?
if [[ $status -eq 0 ]]; then
  echo "Change configuration map of es-artillery-config successfully"
else
  echo "Change configuration map of es-artillery-config failed"
  exit 1
fi
dd_metric=$(echo "$CMD_RESULT" | grep "DD_PREFIX: " | sed -E "s#DD_PREFIX:##g")

#Apply deamonset yaml file
echo " ======================   deploy daemonset es-artillery ================"
CMD_RESULT=$(cat ./k8s/artillery-daemonset.yaml | sed -E "s#gcr\.io/GCE_PROJECT#gcr.io/${gcp_project}#g")
echo "${CMD_RESULT}"
echo "${CMD_RESULT}" | kubectl apply -f -
status=$?
if [[ $status -eq 0 ]]; then
  echo "deploy deamonset es-artillery successfully"
else
  echo "Change deamonset es-artillery failed"
  exit 1
fi

echo "Go to datadog. There are new matrices with prefix: ${dd_metric}"

