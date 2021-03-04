# Dependencies
The following dependencies need to be installed.

# Install
Install dependencies using npm or yarn.

`npm install` 

Install the following tools

## Kubectl
https://kubernetes.io/docs/tasks/tools/install-kubectl/

## Task
https://taskfile.dev/#/installation

## Helm
https://helm.sh/docs/intro/install/

## Docker
You will also need to install docker

## Download Media for Selenium 
Download file into the repo into top level of directory https://storage.cloud.google.com/spaces-dev-practice1/Miscellaneous/sample_video.y4m

# Testing Locally

## Adding Service Account Key For Local Testing
The service account key is used by the script to upload screenshots to GCP storage bucket for analysis after a test. 

## Local development & Basic Testing
There are some built in test scripts for evaluating your code.
Change the following file **./test.js** according to the selenium script you want to run. Then run.

`node test.js`

This should be used just to test changes/debugging to a script before building and running a full scale test. This also does not connect the fake user to a control server so it is limited in what it can do. 

## Running a Local Fake User
To run a local fake user that connects to a control server you can use the following command. 

`npm run start:dev`

Be sure to change the environment variables according to the location of the control server, storage key and browserId(Just an integer, should be unique for all fake users in a given test)

## Additional Config

In **config.js** change the storge configuration to the correct Google Project ID and bucket name.

# Developing
Use one of the existing tests as a template for new created tests. Tests are split up by environment inside of **src/tests/** 

To register the test add it to the **manifests.js** inside the respective environment

# Deploying to K8S
navigate to **/k8s/** 

## Building Image
Change the name of the GCP_PROJECT variable in **Taskfile.yml**. This is where the container registry is located. You may need to configure docker with permissions to the container registry.

`task build-image`

## Cluster Setup

Create Kubernetes cluster within the specified GCP project mentioned in the previous section. The pods will need public access through a Cloud Router and NAT. Each fake user pod requires about 2 CPU's and around 1.5GB of memory, so provision nodes according to this. https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl 

change the **KUBE_CONTEXT** in the **Taskfile.yml** 

## Storage Key Setup
copy the service account key with read/write access to storage into the local folder `keys/storage-key.json` 

Create the secret in the cluster with.

`task create-storage-secret`

## Running Large Meeting
Run `task clean` to remove any existing fake users in the cluster. 
Change the **values.yml** with the address of the controlServer, desired number of fake users, the image registry location. Then run.

`task run-large-meeting-test`

Note: When you do this K8 will pull the latest image for running the fake user.

When this is complete you should be able to see the users connecting to the control server.