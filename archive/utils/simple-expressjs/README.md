# Raw NodeJS

Start server by `node index.js`

Test command
`ab -n 100000 -c 600 -k http://localhost:6666/`

Testing Machine: MacBook Pro 2.3G i7, 16G 1600MHz DDR3, macOS Sierra

__Result__:
```
Concurrency Level:      600
Time taken for tests:   9.854 seconds
Complete requests:      100000
Failed requests:        0
Keep-Alive requests:    100000
Total transferred:      20500000 bytes
HTML transferred:       200000 bytes
Requests per second:    10148.45 [#/sec] (mean)
Time per request:       59.122 [ms] (mean)
Time per request:       0.099 [ms] (mean, across all concurrent requests)
Transfer rate:          2031.67 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.9      0     104
Processing:     2   59   4.3     59     151
Waiting:        2   59   4.3     59     151
Total:          2   59   3.9     59     255

Percentage of the requests served within a certain time (ms)
  50%     59
  66%     60
  75%     60
  80%     61
  90%     62
  95%     64
  98%     67
  99%     69
 100%    255 (longest request)
```

# With attillery

Install artillery by `npm install -g artillery`

# With Docker

Build image by `docker build -t loadtest-simpleexpressjs .`

Start container by `docker run --rm -it -p 6666:6666 loadtest-simpleexpressjs`

Run same AB test `ab -n 100000 -c 600 -k http://localhost:6666/` will result in "apr_socket_recv: Connection reset by peer (54)" error. Found maximum concurrency to be 84, so run this test `ab -n 100000 -c 83 -k http://localhost:6666/`

__Result__:
```
Concurrency Level:      83
Time taken for tests:   3.029 seconds
Complete requests:      12079
Failed requests:        0
Keep-Alive requests:    12079
Total transferred:      2476195 bytes
HTML transferred:       24158 bytes
Requests per second:    3987.28 [#/sec] (mean)
Time per request:       20.816 [ms] (mean)
Time per request:       0.251 [ms] (mean, across all concurrent requests)
Transfer rate:          798.23 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       3
Processing:     1   21   6.3     19     104
Waiting:        1   21   6.3     19     104
Total:          1   21   6.3     19     106

Percentage of the requests served within a certain time (ms)
  50%     19
  66%     21
  75%     23
  80%     24
  90%     26
  95%     29
  98%     36
  99%     42
 100%    106 (longest request)
```
It's much slower than raw nodejs, could be caused by the testing machine. Docker on Mac OS X is running on VM.

# Raw NodeJS on GCE n1-standard-1 (1 vCPU, 3.75 GB memory)

Tests sent from _tjiatest_ (us-central1-a n1-standard-1 10.240.0.16) to _gke-load-test-default-pool-f4ec42e0-gwd3_ (us-central1-a n1-standard-1 10.240.0.15) `ab -c 600 -n 100000 -k http://10.240.0.15:6666/`

__Result:__
```
Concurrency Level:      600
Time taken for tests:   19.152 seconds
Complete requests:      100000
Failed requests:        0
Keep-Alive requests:    100000
Total transferred:      20500000 bytes
HTML transferred:       200000 bytes
Requests per second:    5221.47 [#/sec] (mean)
Time per request:       114.910 [ms] (mean)
Time per request:       0.192 [ms] (mean, across all concurrent requests)
Transfer rate:          1045.31 [Kbytes/sec] received
Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0  15.2      0    1000
Processing:    27  114  17.8    115     225
Waiting:       27  114  17.8    115     225
Total:         33  115  24.3    115    1224
Percentage of the requests served within a certain time (ms)
  50%    115
  66%    122
  75%    126
  80%    129
  90%    135
  95%    142
  98%    151
  99%    159
 100%   1224 (longest request)
```

A better result:
```
Concurrency Level:      600
Time taken for tests:   13.006 seconds
Complete requests:      100000
Failed requests:        0
Keep-Alive requests:    100000
Total transferred:      20500000 bytes
HTML transferred:       200000 bytes
Requests per second:    7688.47 [#/sec] (mean)
Time per request:       78.039 [ms] (mean)
Time per request:       0.130 [ms] (mean, across all concurrent requests)
Transfer rate:          1539.20 [Kbytes/sec] received
Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.4      0       8
Processing:    11   78   5.9     77     117
Waiting:       11   78   5.9     77     117
Total:         18   78   5.7     77     117
Percentage of the requests served within a certain time (ms)
  50%     77
  66%     79
  75%     80
  80%     81
  90%     82
  95%     84
  98%     91
  99%    101
 100%    117 (longest request)
```

The target server CPU usage is around 22%, the load generator CPU usage is around 22%.

With external IP, test sent from _gke-load-test-default-pool-f4ec42e0-gwd3_ (us-central1-a 10.240.0.15 / 104.198.203.123) to _tjiatest_ (us-central1-a n1-standard-1 10.240.0.15 / 104.198.159.127) `ab -c 600 -n 100000 -k http://104.198.159.127:6666/`

Result:
```
Concurrency Level:      600
Time taken for tests:   12.902 seconds
Complete requests:      100000
Failed requests:        0
Keep-Alive requests:    100000
Total transferred:      20500000 bytes
HTML transferred:       200000 bytes
Requests per second:    7751.03 [#/sec] (mean)
Time per request:       77.409 [ms] (mean)
Time per request:       0.129 [ms] (mean, across all concurrent requests)
Transfer rate:          1551.72 [Kbytes/sec] received
Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   1.0      0      60
Processing:    21   77  10.8     75     341
Waiting:       21   77  10.8     75     341
Total:         21   77  11.0     75     341
Percentage of the requests served within a certain time (ms)
  50%     75
  66%     77
  75%     79
  80%     80
  90%     85
  95%     91
  98%     96
  99%    101
 100%    341 (longest request)
```

Test sent from _tjiatest-8cpu_(us-central1-a n1-standard-8 10.240.0.15) to _gke-load-test-default-pool-f4ec42e0-gwd3_ (us-central1-a n1-standard-1 10.240.0.15). ApacheBench doesn't use multiple CPU, so this test is using wrk.

```
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t600 -c600 -d10s http://10.240.0.15:6666/
Running 10s test @ http://10.240.0.15:6666/
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    82.57ms   10.91ms 242.64ms   81.05%
    Req/Sec    12.18      4.32    50.00     76.18%
  73055 requests in 10.10s, 14.28MB read
Requests/sec:   7232.42
Transfer/sec:      1.41MB
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t1500 -c3000 -d10s http://10.240.0.15:6666/
Running 10s test @ http://10.240.0.15:6666/
  1500 threads and 3000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   271.75ms   91.28ms 503.20ms   69.51%
    Req/Sec     8.07      4.09   101.00     93.70%
  72064 requests in 10.11s, 14.09MB read
  Socket errors: connect 0, read 0, write 0, timeout 1446
Requests/sec:   7129.89
Transfer/sec:      1.39MB
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t1500 -c3000 -d30s http://10.240.0.15:6666/
Running 30s test @ http://10.240.0.15:6666/
  1500 threads and 3000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   377.66ms  103.14ms 626.78ms   66.02%
    Req/Sec     5.75      2.87   150.00     79.52%
  209870 requests in 30.11s, 41.03MB read
  Socket errors: connect 0, read 0, write 0, timeout 1464
Requests/sec:   6969.17
Transfer/sec:      1.36MB
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t200 -c6000 -d30s --latency http://10.240.0.15:6666/
Running 30s test @ http://10.240.0.15:6666/
  200 threads and 6000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   527.98ms  167.85ms   1.20s    69.03%
    Req/Sec    46.35     36.52   292.00     83.20%
  Latency Distribution
     50%  543.72ms
     75%  633.29ms
     90%  684.00ms
     99%    1.01s 
  205222 requests in 30.10s, 40.12MB read
  Socket errors: connect 0, read 0, write 0, timeout 2175
Requests/sec:   6817.87
Transfer/sec:      1.33MB
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t600 -c600 -d30s --latency http://35.193.114.82:6666/
Running 30s test @ http://35.193.114.82:6666/
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    74.65ms   12.42ms 352.14ms   96.44%
    Req/Sec    13.50      4.85    90.00     64.32%
  Latency Distribution
     50%   74.00ms
     75%   75.28ms
     90%   78.69ms
     99%  113.05ms
  242615 requests in 30.10s, 47.43MB read
Requests/sec:   8059.81
Transfer/sec:      1.58MB
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t600 -c3000 -d30s --latency http://35.193.114.82:6666/
Running 30s test @ http://35.193.114.82:6666/
  600 threads and 3000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   416.15ms   67.08ms 811.17ms   84.70%
    Req/Sec    12.16      4.54   141.00     92.65%
  Latency Distribution
     50%  395.15ms
     75%  433.47ms
     90%  515.84ms
     99%  633.52ms
  211231 requests in 30.10s, 41.30MB read
  Socket errors: connect 0, read 0, write 0, timeout 173
Requests/sec:   7017.02
Transfer/sec:      1.37MB
```

During the test, the target machine max CPU usage is about 50%.

So we think 8K RPS is the maximum performance we can get. Using external IP and testing within GCP doesn't give too much negative affect if concurrency is reasonable.

# Using k8s/docker on GKE n1-standard-1 (1 vCPU, 3.75 GB memory)

Build image: `docker build -t gcr.io/onesnastaging/loadtest-simpleexpressjs:v1 .`

Push image `gcloud docker -- push gcr.io/onesnastaging/loadtest-simpleexpressjs:v1`

Retrieve kubectl credentials: `gcloud container clusters get-credentials load-test`

Start pod: `kubectl run loadtest-simpleexpressjs --image=gcr.io/onesnastaging/loadtest-simpleexpressjs:v1 --port 6666`

Create service: `kubectl expose deployment loadtest-simpleexpressjs --type=LoadBalancer --port 6666`

Test with `ab -c 600 -n 100000 -k http://10.24.2.4:6666/`, 10.24.2.4 is the pod IP.

__Result:__
```
Concurrency Level:      600
Time taken for tests:   16.993 seconds
Complete requests:      100000
Failed requests:        0
Keep-Alive requests:    100000
Total transferred:      20500000 bytes
HTML transferred:       200000 bytes
Requests per second:    5884.63 [#/sec] (mean)
Time per request:       101.961 [ms] (mean)
Time per request:       0.170 [ms] (mean, across all concurrent requests)
Transfer rate:          1178.07 [Kbytes/sec] received
Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   1.0      0      14
Processing:    19  102  74.6     98    2158
Waiting:       19  102  74.6     98    2158
Total:         19  102  75.3     98    2172
Percentage of the requests served within a certain time (ms)
  50%     98
  66%    101
  75%    103
  80%    105
  90%    113
  95%    125
  98%    139
  99%    152
 100%   2172 (longest request)
```

Result of `./wrk -t600 -c600 -d15s --latency http://10.24.2.4:6666/`:
```
Running 15s test @ http://10.24.2.4:6666/
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    95.18ms   11.60ms 449.49ms   88.16%
    Req/Sec    10.61      2.80    50.00     91.11%
  Latency Distribution
     50%   94.07ms
     75%   97.41ms
     90%  104.16ms
     99%  141.73ms
  93629 requests in 15.10s, 18.30MB read
Requests/sec:   6200.38
Transfer/sec:      1.21MB
```

The pod CPU usage is about 43%.

Clean up and delete service: `kubectl delete service loadtest-simpleexpressjs`

# Using k8s/docker on GKE n1-standard-1 more than one pods

With scale of 2, 2 pods on 2 nodes:
```
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t600 -c600 -d15s --latency http://10.24.2.4:6666/
Running 15s test @ http://10.24.2.4:6666/
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   102.23ms   15.62ms 202.57ms   83.31%
    Req/Sec    10.03      2.21    20.00     90.88%
  Latency Distribution
     50%   99.26ms
     75%  106.64ms
     90%  122.18ms
     99%  174.71ms
  87296 requests in 15.10s, 17.07MB read
Requests/sec:   5780.62
Transfer/sec:      1.13MB
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t600 -c600 -d15s --latency http://10.240.0.19:30964
Running 15s test @ http://10.240.0.19:30964
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    49.30ms    8.45ms 131.22ms   86.17%
    Req/Sec    20.31      4.96   110.00     77.24%
  Latency Distribution
     50%   50.10ms
     75%   53.01ms
     90%   56.85ms
     99%   80.06ms
  183597 requests in 15.10s, 35.89MB read
Requests/sec:  12157.89
Transfer/sec:      2.38MB
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t600 -c600 -d15s --latency http://35.192.184.252:6666/
Running 15s test @ http://35.192.184.252:6666/
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    48.03ms   11.11ms 315.43ms   94.35%
    Req/Sec    21.01      4.53    90.00     79.72%
  Latency Distribution
     50%   46.16ms
     75%   49.30ms
     90%   54.30ms
     99%   82.85ms
  189132 requests in 15.10s, 36.98MB read
Requests/sec:  12524.80
Transfer/sec:      2.45MB
```

Total CPU usage is about 63%.

With scale of 3, 3 pods are distributed on 3 nodes.
```
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t600 -c600 -d15s --latency http://35.192.184.252:6666/
Running 15s test @ http://35.192.184.252:6666/
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    33.57ms   13.10ms 339.16ms   95.11%
    Req/Sec    30.52      6.30   110.00     68.11%
  Latency Distribution
     50%   30.64ms
     75%   33.25ms
     90%   38.93ms
     99%   74.69ms
  274969 requests in 15.10s, 53.76MB read
Requests/sec:  18209.17
Transfer/sec:      3.56MB
```

Total CPU usage is about 74%.

With scale of 6, k8s put 3 pods on 1 node, 2 pods on another node, 1 pod on the last node.

```
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t600 -c600 -d15s --latency http://35.192.184.252:6666/
Running 15s test @ http://35.192.184.252:6666/
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    36.47ms   22.62ms 365.65ms   65.06%
    Req/Sec    28.19     18.56   181.00     84.96%
  Latency Distribution
     50%   32.42ms
     75%   50.09ms
     90%   65.34ms
     99%   93.58ms
  254225 requests in 15.10s, 49.70MB read
Requests/sec:  16835.01
Transfer/sec:      3.29MB
jackj@tjiatest-8cpu:~/wrk$ ./wrk -t600 -c600 -d15s --latency http://35.192.184.252:6666/
Running 15s test @ http://35.192.184.252:6666/
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    37.68ms   22.15ms 379.87ms   84.64%
    Req/Sec    27.75     15.35   220.00     75.09%
  Latency Distribution
     50%   39.37ms
     75%   48.53ms
     90%   54.84ms
     99%  117.63ms
  249052 requests in 15.10s, 48.69MB read
Requests/sec:  16492.38
Transfer/sec:      3.22MB
```

But total CPU usage is about 216%.

Interesting points:
- Hitting on one node:nodePort is same as hitting the cluster. The traffice will be dispatched to other nodes.
- External IP doesn't give negative impact to the result.
- With several tests, single pod never performs better than 6K RPS, comparing 8K RPS than running without k8s/docker.
- More than one pod on one node doesn't give better performace, but could be worse.

# Check Profiling

Start server by `node --prof index.js`

Process Profiling Log `node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt` 
