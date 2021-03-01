# Test Plans

* Find best testing tool
* Performance of MongoDB
  - Bare MongoDB on different Google Cloud instances
  - Create Test Database with large data
  - Performance Changes with large data
  - mlab testing/staging instance performance
  - mlab production instance performance
* Performance of Restful API
  - Simple ExpressJS performance on Google Cloud instances
  - Find out why express-js cannot utilize 100% CPU

# Conclusions

## Testing Tools

- Locust.io gets much worse performace than ApacheBench/wrk. It takes 12 slaves running on 6 n1-standard-2 machines to reach >6K RPS.
- wrk gets relatively better result than ApacheBench, but not significant.

## General Performance of GCP + nodejs

- Simple express-js can reach max 8K RPS. But CPU usage of target machine is about 60% but still not fully utilized.
- K8s/docker could hurt performance about 30%. With k8s/docker, single simple express-js can only reach 5K ~ 6K RPS.
- Using external IP doesn't impact result if we have reasonable concurrency.
