#!/bin/bash

gcp_project="onesnastaging"
cluster_name="artillery-vu"
size=3
zone="us-central1-a"
#Default is 1 vcpu machine
machine_type="n1-standard-1"

max_node=100 
min_node=3
need_help=false

while [ "$1" != "" ]; do
  case $1 in
    -p | --project ) shift
                  gcp_project=$1
                  ;;
    -c | --cluster) shift
                  cluster_name=$1
                  ;;
    -s | --size) shift
                 size=$1
                 ;;
    -z | --zone) shift
                 zone=$1
                 ;;
    -m | --machine) shift
                 machine_type=$1
                 ;;
    -h | --help) need_help=true
                 break
                 ;;
  esac
  shift
done

# Print options information
if [ "$need_help" = true ]; then
  echo "Options:"
  echo ""
  echo "-h, --help      output usage information"
  echo "-p, --project   The project name in gcp, default value is onesnastaging"
  echo "-c, --cluster   The cluster name of kubernetes, default value is artillery-vu"
  echo "-s, --size      The number of pods, default value is 3"
  echo "-z, --zone      THe zone of the the cluster"
  echo "-m, --machine   The machine type in GCP, default value is n1-standard-1"
  exit
fi

if [ $size -gt $max_node ]; then
  echo "The requested size $size is larger than max node number $max_node"
  exit 1
fi
if [ $size -lt $min_node ]; then
  echo "The requested size $size is smaller than min node number $min_node"
  exit 1
fi
if [ $size -lt 1 ]; then
  echo "The requested size $size must larger than 0"
  exit 1
fi

echo "GCP Project= $gcp_project"
echo "Cluster=     $cluster_name" 
echo "size =       $size"
echo "zone=        $zone"
echo "machine=     $machine_type"

#Check cluster existed or not
need_create_cluster=false
echo "Checking the existence of the cluster"
CMD="gcloud container clusters list --project=$gcp_project --filter=name:$cluster_name --format=\"table(name, NUM_NODES)\""
echo $CMD
CMD_RESULT=$(gcloud container clusters list --project=$gcp_project --filter=name:$cluster_name --format="table(name, NUM_NODES, LOCATION)")
echo "$CMD_RESULT"
if [[ $CMD_RESULT == *"$cluster_name"* ]]; then
  echo "The cluster $cluster_name alreasy existed."
else
  echo "The cluster $cluster_name is not existed!"
  need_create_cluster=true
fi

current_size=$(echo "$CMD_RESULT" | grep "$cluster_name" | sed -E "s#$cluster_name *##g" | sed -E "s# +.*##g")
echo "Current size of cluster is ${current_size}"

current_location=$(echo "$CMD_RESULT" | grep "$cluster_name" | sed -E "s#[a-zA-Z0-9-]+ +[0-9]+ +##g")
echo "Current region of cluster is ${current_location}"

cluster_size_changed=false
if [[ ${current_size} == $size ]]; then
   echo "The cluster $cluster_name size is not changed"
else
   cluster_size_changed=true
   echo "The cluster $cluster_name size is changed"
fi

#If the cluster not existed then create it.
if [ "$need_create_cluster" = true ]; then
  echo "Create a cluster now"
  CMD="gcloud container clusters create $cluster_name --zone=$zone --machine-type=$machine_type --project=$gcp_project  --num-nodes=$size --no-enable-ip-alias"
  echo $CMD
  $CMD
  status=$?
  if [[ $status -eq 0 ]]; then
    echo "Create cluster $cluster_name successfully!"
  else
    echo "Create cluster $cluster_name failed!"
    exit 1
  fi
else
  if [[ "$cluster_size_changed" == true ]]; then
    echo "Change cluster $cluster_name size now"
    CMD="gcloud container clusters resize $cluster_name --node-pool=default-pool --num-nodes=$size --project=$gcp_project --region=$current_location"
    echo $CMD
    $CMD
    status=$?
    if [[ $status -eq 0 ]]; then
      echo "Change cluster $cluster_name size to $size successfully!"
    else
      echo "Create cluster $cluster_name size to $size failed!"
      exit 1
    fi
  fi
fi

#Connect to the cluster
echo "Connect to the cluster now"
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

#Check reload being installed
#https://github.com/stakater/Reloader
install_reloader=false
CMD="kubectl get deployment reloader-reloader"
echo $CMD
$CMD
status=$?
if [[ $status -eq 0 ]]; then
  echo "The app reloader-reloader was installed already."
else
  echo "The app reloader-reloader is not installed yet."
  install_reloader=true
fi

#If reloader is not installed, install it.
if [[ "$install_reloader" = true ]]; then
  echo "Install reloader now"
  CMD="kubectl apply -f https://raw.githubusercontent.com/stakater/Reloader/master/deployments/kubernetes/reloader.yaml"
  echo $CMD
  $CMD
  status=$?
  if [[ $status -eq 0 ]]; then
    echo "Install reloader successfully!"
  else
    echo "Install reloader failed!"
  fi
fi

#Remove existed installed daemonset
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

#Check secret of Datadog api key
CMD="kubectl get secret es-artillery-secret"
echo $CMD
CMD_RESULT=$($CMD)
status=$?
if [[ $status -eq 0 ]]; then
  echo "The secret of es-artillery-secret is existed."
else
  echo Please input datadog api key:
  read -s DD_API_KEY
  DD_API_KEY_MASK=$(echo "$DD_API_KEY" | sed -E 's/(.{6}).{20}/\1.../')
  CMD="kubectl create secret generic es-artillery-secret --from-literal='DD_API_KEY=${DD_API_KEY_MASK}'"
  echo $CMD
  kubectl create secret generic es-artillery-secret --from-literal="DD_API_KEY=${DD_API_KEY}"
  status=$?
  if [[ $status -eq 0 ]]; then
    echo "Add the secret of es-artillery-secret successfully"
  else 
    echo "Add the secret of es-artillery-secret failed"
  fi
fi 

