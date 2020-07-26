# Test the artillery locally
  Enter the folder deploy-artillery-v2
  ./start-local.sh -f [The path of the artillery file]
  For example:
  If you want to test users landing spaces.
  You should prepare the file user-jwts.csv in the folder artillery-vu with format username,spacesid,jwt_token
  Then run the command 
  ```
  ./start-local.sh -f artillery-vu/artillery-vu.yaml
  ```
# Prepare GKE environment
  Before do following operation, please make sure you already login gcp. Please follow the link 
  https://cloud.google.com/sdk/gcloud/reference/auth/login.
  And you already has a datadog account which support integration function.

  Run command: 
  ```
  ./init.sh
  ```
  You can get help by command
  ```
  ./init.sh -h
  ```
  
  When you install the environment in a new GKE cluster, it will ask you provide datadog metrics api key. You should go to the datadog console copy & paste a datadog api key.

  You can adjust the size of cluster (it also decide the number of artillery agent) by command
  ```
  ./init.sh -s [The new size of cluster]
  ```

# Run a test case
  Run command:
  ```
  ./start.sh -d [The folder which has all files of the test case]
  ```
  For example:
  If you want to test users landing spaces.
  You should prepare the file user-jwts.csv in the folder artillery-vu with format username,spacesid,jwt_token
  Then run the command 
  ```
  ./start.sh -d ./artillery-vu
  ```
  If everything is properly, you should see "Go to datadog. There are new matrices with prefix: xxxxx"
  You can create different graph in datadog to see the testing process.
  Tip:
  If you want to see the concurrent users, you can create graph in datadog like
  ```
  cumsum(sum:es_artillery_20200724225418.scenarios.created{*}.as_count())-cumsum(sum:es_artillery_20200724225418.scenarios.completed{*}.as_count())
  ```
  See the reference https://docs.datadoghq.com/dashboards/functions/arithmetic/#cumulative-sum