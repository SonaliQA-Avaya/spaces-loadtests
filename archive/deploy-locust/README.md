# Test Result

Test Target http://10.240.0.10:30080/health.

- Using internal IP of instance gke-spaces-default-pool-84da82bf-t22d

## Expected Minimal Performance

__Client__ tjiatest:

- _n1-standard-2_
- us-central1-a
- debian 8
- int IP 10.240.0.18
- ext IP 104.154.173.10

Test with `ab -c 600 -n 100000 -k http://10.240.0.10:30080/health`:

__Result__:
```
Concurrency Level:      600
Time taken for tests:   7.008 seconds
Complete requests:      100000
Failed requests:        0
Keep-Alive requests:    100000
Total transferred:      16400000 bytes
HTML transferred:       200000 bytes
Requests per second:    14270.00 [#/sec] (mean)
Time per request:       42.046 [ms] (mean)
Time per request:       0.070 [ms] (mean, across all concurrent requests)
Transfer rate:          2285.43 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.4      0       7
Processing:     6   42  33.8     24     396
Waiting:        6   42  33.8     24     396
Total:          7   42  33.8     24     399

Percentage of the requests served within a certain time (ms)
  50%     24
  66%     48
  75%     55
  80%     58
  90%     89
  95%    101
  98%    122
  99%    173
 100%    399 (longest request)
```

The tjiatest instance CPUs is around 2.6%. Target machine 10.240.0.10 CPU is around 60%. The target machine actually has 2 pods running.

__Client__ tjiatest:

- _n1-standard-1_
- us-central1-a
- debian 8

Test with `ab -c 600 -n 100000 -k http://10.240.0.10:30080/health`:

__Result__:
```
Concurrency Level:      600
Time taken for tests:   18.530 seconds
Complete requests:      100000
Failed requests:        0
Keep-Alive requests:    100000
Total transferred:      16400000 bytes
HTML transferred:       200000 bytes
Requests per second:    5396.74 [#/sec] (mean)
Time per request:       111.178 [ms] (mean)
Time per request:       0.185 [ms] (mean, across all concurrent requests)
Transfer rate:          864.32 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    2  50.0      0    1023
Processing:     8  108  25.3    107     564
Waiting:        8  108  25.3    107     564
Total:         15  111  62.7    107    1443

Percentage of the requests served within a certain time (ms)
  50%    107
  66%    111
  75%    114
  80%    116
  90%    125
  95%    135
  98%    150
  99%    174
 100%   1443 (longest request)
```

Without keep-alive:
```
Concurrency Level:      600
Time taken for tests:   32.715 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      15900000 bytes
HTML transferred:       200000 bytes
Requests per second:    3056.68 [#/sec] (mean)
Time per request:       196.291 [ms] (mean)
Time per request:       0.327 [ms] (mean, across all concurrent requests)
Transfer rate:          474.62 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0  121 444.0      0    7296
Processing:     6   73  42.7     78    1705
Waiting:        6   73  42.7     78    1705
Total:         15  194 454.4     80    7375

Percentage of the requests served within a certain time (ms)
  50%     80
  66%     84
  75%     87
  80%     91
  90%    131
  95%   1096
  98%   1135
  99%   3080
 100%   7375 (longest request)
```

## Result with Locust

__Client__ cluster loadtest-locust:

- us-central1-a
- n1-standard-1
- size: 3
- pods:
```
NAME                  READY     STATUS    RESTARTS   AGE       IP           NODE
locust-master-vq4rv   1/1       Running   0          2m        10.24.2.3    gke-loadtest-locust-default-pool-7ff3b52c-wlgm
locust-worker-8dbtf   1/1       Running   0          24s       10.24.2.4    gke-loadtest-locust-default-pool-7ff3b52c-wlgm
locust-worker-ndtc1   1/1       Running   0          24s       10.24.0.10   gke-loadtest-locust-default-pool-7ff3b52c-v3tn
```

__Result__:

```
600 Users
2 Slaves

Method  Name     # requests  # failures  Median response time  Average response time Min response time Max response time Average Content Size  Requests/s
GET     /health  75607       0           300                   307                   112               831               2                     1459.76
None    Total    75607       0           300                   307                   112               831               2                     1459.76
```

The 2 slaves pods CPUs have reached 100%. Target machine 10.240.0.10 CPU is around 40%.

__Client__ cluster loadtest-locust:

- us-central1-a
- n1-standard-2
- size: 6
- pods:
```
NAME                  READY     STATUS    RESTARTS   AGE       IP           NODE
locust-master-6q9nz   1/1       Running   0          13m       10.24.2.8    gke-loadtest-locust-default-pool-d3c259e7-7zcl
locust-worker-46r0v   1/1       Running   0          11m       10.24.0.8    gke-loadtest-locust-default-pool-d3c259e7-8p0w
locust-worker-5sjss   1/1       Running   0          5m        10.24.4.2    gke-loadtest-locust-default-pool-d3c259e7-rvsk
locust-worker-7sq4h   1/1       Running   0          11m       10.24.2.9    gke-loadtest-locust-default-pool-d3c259e7-7zcl
locust-worker-843dc   1/1       Running   0          5m        10.24.5.3    gke-loadtest-locust-default-pool-d3c259e7-nt5r
locust-worker-gfv2z   1/1       Running   0          5m        10.24.5.2    gke-loadtest-locust-default-pool-d3c259e7-nt5r
locust-worker-gl2g5   1/1       Running   0          9m        10.24.2.10   gke-loadtest-locust-default-pool-d3c259e7-7zcl
locust-worker-jst16   1/1       Running   0          13m       10.24.0.7    gke-loadtest-locust-default-pool-d3c259e7-8p0w
locust-worker-kdrkf   1/1       Running   0          8m        10.24.1.8    gke-loadtest-locust-default-pool-d3c259e7-9zvv
locust-worker-kk7ng   1/1       Running   0          5m        10.24.3.3    gke-loadtest-locust-default-pool-d3c259e7-s43x
locust-worker-pkf66   1/1       Running   0          5m        10.24.3.2    gke-loadtest-locust-default-pool-d3c259e7-s43x
locust-worker-s12j2   1/1       Running   0          5m        10.24.4.3    gke-loadtest-locust-default-pool-d3c259e7-rvsk
locust-worker-v6b63   1/1       Running   0          13m       10.24.1.7    gke-loadtest-locust-default-pool-d3c259e7-9zvv
```

__Result__:

```
3600 Users
12 Slaves

Method  Name     # requests  # failures  Median response time  Average response time Min response time Max response time Average Content Size  Requests/s
GET     /health  535247      0           440                   452                   67                1616              2                     6226.1
None    Total    535247      0           440                   452                   67                1616              2                     6226.1
```

The 2 slaves pods CPUs have reached 100%. Target machine 10.240.0.10 CPU is around 40%.

## Conclusion

Locust gets much lower result than ApacheBench. Need to find better tool.

Based on the [Python Request](http://docs.python-requests.org/en/master/) module it uses, it already has the favor of keep-alive.

- Possible explanation: [reqs/sec is lower than other tools result](https://github.com/locustio/locust/issues/586)
- (Open Source Load Testing Tools Review - Benchmarks](http://blog.loadimpact.com/open-source-load-testing-tool-benchmarks)
