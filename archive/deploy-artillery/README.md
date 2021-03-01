# Cluster Tool to Test Socket.io

## Deploy the tool

Update `socketio/connection.yaml` with correct testing URL and token. This is the default test file will be pushed to testing pods.

In order to estimate the load generator size, you need to know how many connections you are targeting to. For each socket.io connection to Spaces, the load generator will accquire about 200K memory. Since we usually use standard machine type, which has 3.75G memory, deduct other memory used by kube-system, roughly for each load generator pod, we only have 2G left. That means, for each pod, may only create 10,000 socketio connections. If you wish to test about 100,000 connections, you will need at least 10 pods/machines.

Then run command: `./deploy.sh -s <size> -p <project>` to create cluster, deployments and testing pods.

## Run the test

Run this command to run default `connection.yaml` test case: `node run.js -- connection.yaml`.

This test case only create connections, doesn't really send any messages.

If you want to test sending messages, can try `../socketio/message.yaml` test case.

## Update test case

You can upload test case files to all pods with this command: `node ../deploy-wrk/cp.js ../socketio/<test-case.yaml> /test/<test-case.yaml>`.

To run the test case uploaded, run this command: `node run.js -- <test-case.yaml>`.
