# Running load tests

Even though tests can be started from the local terminal, it requires some tools to be installed. It's much easier to use cloudbuild trigger to start or stop the test 

e.g. [loadtests-k6-start-loganstaging](https://console.cloud.google.com/cloud-build/triggers/edit/f45ff496-e7f5-4d2d-8d76-ebd72aabaf62?project=onesnastaging)

to see all triggers simply filter by `k6` in [loganstaging cloudbuild triggers](https://console.cloud.google.com/cloud-build/triggers?project=onesnastaging&pageState=(%22triggers%22:(%22f%22:%22%255B%257B_22k_22_3A_22_22_2C_22t_22_3A10_2C_22v_22_3A_22_5C_22k6_5C_22_22%257D%255D%22)))

 
## Start load test from local command line 

It still runs tests from kube cluster [loadtests-k6](https://console.cloud.google.com/kubernetes/clusters/details/us-central1-c/loadtest-k6/details?project=onesnastaging) with this option.



**first time**: Make sure that `kubectl context` for `loadtest-k6` project exists on your machine.

```
cd infra
task kube-context 
```

- start the test `task cloud:run`
- monitor results on [k6 load test metrics](https://p.datadoghq.com/sb/b7425de83-fd40604f385c9c60e6c07476e3a0fafb) Datadog dashboard

to modify test settings update `infra/k6/values.yaml` 

- `task cloud:stop` to stop execution (deletes k6 worker pods)

## run with different settings 

- create values file in infra/k6 e.g. `values-large-meeting.yaml` 
- create task to use this values file, see `infra/Taskfile: run-large-meeting`
- run: `task cloud:run-large-meeting`


## Cleanup 

- `task cloud:stop-all` after finishing load test to remove idle datadog agents


# Development
## Installation

- install k6 

```

brew install k6
brew install go-task/tap/go-task
brew install helm
brew install gsplit
```

## Run 

All mentioned commands are configured in `Taskfile.yml`, see this file for more details and config options.

### Run quick load test

`task quick-run` - will run quick test (most likely 10 users for 10 minutes). It's used to test that the script is fully functional.


Each operation: login, join, chat can be executed directly by running: 

- `task login-test`
- `task join-test`
- `task chat-test`
- `task anon-test`

To see requests/response add `--http-debug` parameter to `k6 run` command in Taskfile.yml


### Run load test with full data locally

Before running this task first time, you need to split big csv file into smaller chunks, so each virtual user only reads small file with account info, it reduces memory requirements. 

- `task split-data-file`

**NOTE** it requires `GNU` `split` installed, can be done with `brew install coreutils`

**run load test** 

- on mac execute `ulimit -n 24000` in the terminal before running the test, it changes the limit on number of open files in the current session only, without it you may start getting errors `socket: too many open files` with `VUS > 50`
- `task run-local` will ran test with configuratin taked from `src/spaces.test.js` `options` object 



# Config options 

- `CHAT_DURATION` - how long in seconds websocket connection stays open until test loop end and start over again, it's used to simulate chat session duration

- `DATA_PATH` path to csv file with username password
- `DATA_FILE_PREFIX` - prefix for csv files that are split in groups, to reduce memory usage. Each VU just reads from specific chunk and does not load big file with all the records

- `DATA_FILE_START_INDEX` - if set, start using user records starting from position specified, `0` by default. At the moment only active when `DATA_FILE_PREFIX` is set

- `JOIN_TOPIC_ID` if set all users will join this topic instead of splitting clusters and using personal meeting rooms to chat 
- `SKIP_JOIN_API_CALLS` - skip making api calls for join, only effective if `JOIN_TOPIC_ID` is defined 

- `NEW_MESSAGE_INTERVAL` - in seconds, how often new message is sent while chat session is open
- `SKIP_JOIN_MESSAGE` - if set, will skip sending message after joining the chat
- `NEW_MESSAGE_CHANCE` - probability of sending a messages on `NEW_MESSAGE_INTERVAL`, values `0-1`, 1 by default

- `MEETING_SIZE` - number of users per meeting when personal meetings as used, 10 by default, only active when `JOIN_TOPIC_ID` is not set
- `DASHBOARD_VISIT_RATE` - chance that in any iteration VU will emulate visiting dashboard (with heavy `/statistics` call)

- `ENABLE_MPAAS` - if set will make MPaaS call to MPaaS token;
**note** this does not simulate WS connections for the video

## What is tested 

- login to the system to get JWT token using username/password
- simulate join space, that triggers all api calls (see `src/join.js`)
- open WebSocket connection for chat channel and send messages, 1 message is sent after joining, and repated messages are sent every `NEW_MESSAGE_INTERVAL` seconds. WebSocket connection is kept open for `CHAT_DURATION` seconds

- certain percentage of users are joined as anonymous users; percentage is controlled with `ANONNYMOUS_RATE` variable, decimal, from `0.0 to 1.0`. 10% by default.

- there is a small delay after executing 


### Build and push docker image for cloud runs


run k6 start trigger with `_BUILD_WORKER_IMAGE=yes` or with `task make-image`


# Other docs
 
[QC k6 notes from Sonali](https://confluence.forge.avaya.com/pages/viewpage.action?pageId=241784580)


[Testing method, join rate](https://vacoss-my.sharepoint.com/:w:/g/personal/rlyashov_vaco_com/EeYbJn7fHPUkNZ1MuvMXS3oBjk3ZNHirInDX5pvi-6u6ng?e=UbBPlN)

[Load test report - Sep, 2020](https://vacoss-my.sharepoint.com/:w:/g/personal/rlyashov_vaco_com/EamUZVOXmTojp8yXV18IFqsB80UgyDgxshqpwwNVUoEd5g?e=hbKcog)