# Architecture

The testing tool consists of two components, the control server and the testing client.

## Testing Client

### Summary

The testing client is a small node.js program that opens a persistent websocket connection with the control server and spins up a chrome instance controlled through selenium. After establishing a connection with the control server it moves into a `ready` state where it awaits commands from the control server to beginning running a test script. While running the test script, the testing client is `locked` state where it cannot be initiated to start another test. Depeneding on the type of test the client is running, it may be available to send messages that are triggered from the control server via a socket connection. Also depending on the test, the testing client may also abruptly signalled by the control server to leave the meeting. 

If the client encounters any errors during the test, the test will terminate and the testing client will upload a screen shot of the chrome view to a configured bucket. 


When the test terminates, the testing client signals the control server the control server that it is available to run another test. The credentials used for the previous test are released to be assigned to a new testing client.

### Deployment

During deployment the testing client is passed a browserId(integer) and the IP address of the control server.


## Control Server

The control server orchestrates the dispatching of the testing clients and apply more aggressive loads to a space. 

Basic Functionality: 
- The control server can tell many testing clients to join a meeting.
- The control server can tell many testing clients to leave a meeting.
- The control server can tell many testing clients to send a chat message.


# Typical Deployment

For simplicity keep, everything in same GCP project: Container Registry, VM, Kubernetes Cluster, Storage,...

# Setup and Deploy VM for control server:
1. Build Image for control server and upload to Container Registry.
2. Create VM (see README.md for specs) with HTTP open, and run the image. The image should be running on port 80 by default. 
3. Start VM and test connection.

# Deploy Testing Users
Make sure your local machine kubectl can connect to the GKE cluster and docker is configured.

1. Create GKE Cluster with access to the internet. 
2. Add service-account credentials as a secret to a cluster.
3. Change config to point to GCS bucket.
4. Change k8s values for the controlServerIp and desired number of users.
5. Deploy to K8s.

# Running Tests
The control server exposes a REST API for dispatching each single users with an allocated set of credentials to join a space on demand.
