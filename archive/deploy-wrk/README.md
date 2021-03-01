# Prepare Load Generator of wrk

[wrk](https://github.com/wg/wrk) is a modern HTTP benchmarking tool capable of generating significant load when run on a single multi-core CPU.

## Manually Install WRK on one testing machine

- Create a VM instance on Google Cloud:
  + use n1-standard-2 machine type, or better,
  + use Debian 8 as operation system
- Install Dependencies by running these command:
```
sudo apt-get update
sudo apt-get install -y build-essential luajit openssl git
```
- Get wrk by `git clone https://github.com/wg/wrk`
- Compile wrk:
```
cd wrk
make
```

## Using deploy script to create load generator cluster

Use command `./deploy.sh <paths_file>` to deploy the test script to cluster. Use `./deploy.sh -h` to check available options.

Example to deploy test paths file of `../restapi/paths.yaml` is `./deploy.sh ../restapi/paths.yaml`.

Wait until the wrk-workers are created.

IMPORTANT: make sure to delete the cluster after test.

### deploy script options

- `-p|--project`: project name, default is `onesnastaging`.
- `-c|--cluster`: cluster name, default is `loadtest-wrk`.
- `-s|--size`: cluster size, default is 3. This will decide how many instances/workers you have to generate load.
- `-m|--machine`: machine type, default is `n1-standard-1`. You can use better machine for example `n1-standard-4`.
- `-z|--zone`: cluster zone, default is `us-central1-a`.

## Test default nginx server

Server: n1-standard-1 instance group in us-central1-a, debian 8 with default nginx setting
Client: 4 n1-standard-1 k8s cluster in us-central1-a
Test tool: wrk cluster

Test command `node run.js -- -c300 -t300 -d30s --latency http://35.186.249.71/`

### 1 instance

```
6 pods found: [ 'wrk-worker-5vj07',
  'wrk-worker-b533m',
  'wrk-worker-ld9tz',
  'wrk-worker-p3d99',
  'wrk-worker-s7wjd',
  'wrk-worker-tn677' ]
>>>>>>> result of pod wrk-worker-5vj07
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   108.74ms  179.29ms   1.94s    89.05%
    Req/Sec    32.75     26.74   220.00     67.79%
  Latency Distribution
     50%   18.79ms
     75%  137.22ms
     90%  306.35ms
     99%  873.58ms
  202524 requests in 30.10s, 211.87MB read
  Socket errors: connect 0, read 0, write 0, timeout 50
  Non-2xx or 3xx responses: 5
Requests/sec:   6727.86
Transfer/sec:      7.04MB

>>>>>>> result of pod wrk-worker-b533m
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   113.48ms  190.78ms   2.00s    89.15%
    Req/Sec    33.01     26.97   191.00     67.44%
  Latency Distribution
     50%   18.46ms
     75%  140.61ms
     90%  322.10ms
     99%  936.46ms
  200796 requests in 30.10s, 210.06MB read
  Socket errors: connect 0, read 0, write 0, timeout 52
  Non-2xx or 3xx responses: 11
Requests/sec:   6670.69
Transfer/sec:      6.98MB

>>>>>>> result of pod wrk-worker-ld9tz
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   110.74ms  187.04ms   1.99s    89.14%
    Req/Sec    33.68     27.38   212.00     73.04%
  Latency Distribution
     50%   17.86ms
     75%  136.32ms
     90%  315.53ms
     99%  920.02ms
  204707 requests in 30.10s, 214.16MB read
  Socket errors: connect 0, read 0, write 0, timeout 65
  Non-2xx or 3xx responses: 8
Requests/sec:   6800.66
Transfer/sec:      7.11MB

>>>>>>> result of pod wrk-worker-p3d99
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   106.67ms  177.76ms   1.99s    89.19%
    Req/Sec    33.09     27.53   454.00     75.91%
  Latency Distribution
     50%   18.46ms
     75%  133.48ms
     90%  299.64ms
     99%  873.27ms
  205377 requests in 30.10s, 214.86MB read
  Socket errors: connect 0, read 0, write 0, timeout 64
  Non-2xx or 3xx responses: 9
Requests/sec:   6822.77
Transfer/sec:      7.14MB

>>>>>>> result of pod wrk-worker-s7wjd
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   108.68ms  179.39ms   1.99s    88.93%
    Req/Sec    32.91     26.85   247.00     67.35%
  Latency Distribution
     50%   18.44ms
     75%  137.24ms
     90%  308.70ms
     99%  874.87ms
  201764 requests in 30.10s, 211.08MB read
  Socket errors: connect 0, read 0, write 0, timeout 63
  Non-2xx or 3xx responses: 7
Requests/sec:   6702.99
Transfer/sec:      7.01MB

>>>>>>> result of pod wrk-worker-tn677
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   108.73ms  183.14ms   1.98s    89.24%
    Req/Sec    33.58     27.12   212.00     73.51%
  Latency Distribution
     50%   18.28ms
     75%  133.82ms
     90%  306.71ms
     99%  904.22ms
  207584 requests in 30.10s, 217.17MB read
  Socket errors: connect 0, read 0, write 0, timeout 47
  Non-2xx or 3xx responses: 9
Requests/sec:   6896.78
Transfer/sec:      7.22MB

>>>>>>> aggregated result of all pods
Total requests  : 1222752
Duration        : 30.099999999999998
Average RPS     : 40622.990033222595
```

- Max CPU: 36%

### 2 instances

```
6 pods found: [ 'wrk-worker-5vj07',
  'wrk-worker-b533m',
  'wrk-worker-ld9tz',
  'wrk-worker-p3d99',
  'wrk-worker-s7wjd',
  'wrk-worker-tn677' ]
>>>>>>> result of pod wrk-worker-5vj07
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    83.83ms  156.36ms   1.93s    89.91%
    Req/Sec    53.70     41.71   383.00     66.00%
  Latency Distribution
     50%   15.02ms
     75%   94.78ms
     90%  241.96ms
     99%  783.90ms
  359571 requests in 30.10s, 376.16MB read
  Socket errors: connect 0, read 0, write 0, timeout 30
  Non-2xx or 3xx responses: 26
Requests/sec:  11945.35
Transfer/sec:     12.50MB

>>>>>>> result of pod wrk-worker-b533m
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    86.74ms  161.09ms   1.99s    89.90%
    Req/Sec    51.93     41.08   505.00     66.15%
  Latency Distribution
     50%   15.34ms
     75%   99.39ms
     90%  249.54ms
     99%  806.51ms
  343339 requests in 30.10s, 359.17MB read
  Socket errors: connect 0, read 0, write 0, timeout 33
  Non-2xx or 3xx responses: 37
Requests/sec:  11405.62
Transfer/sec:     11.93MB

>>>>>>> result of pod wrk-worker-ld9tz
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    80.29ms  147.03ms   1.93s    89.72%
    Req/Sec    53.45     41.74   373.00     66.13%
  Latency Distribution
     50%   15.12ms
     75%   92.81ms
     90%  231.90ms
     99%  726.41ms
  363237 requests in 30.10s, 380.00MB read
  Socket errors: connect 0, read 0, write 0, timeout 13
  Non-2xx or 3xx responses: 21
Requests/sec:  12067.72
Transfer/sec:     12.62MB

>>>>>>> result of pod wrk-worker-p3d99
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    82.32ms  153.41ms   1.98s    89.95%
    Req/Sec    54.20     42.20   330.00     65.71%
  Latency Distribution
     50%   15.02ms
     75%   93.82ms
     90%  236.69ms
     99%  764.00ms
  365793 requests in 30.10s, 382.67MB read
  Socket errors: connect 0, read 0, write 0, timeout 15
  Non-2xx or 3xx responses: 21
Requests/sec:  12152.37
Transfer/sec:     12.71MB

>>>>>>> result of pod wrk-worker-s7wjd
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    82.44ms  151.70ms   1.99s    89.78%
    Req/Sec    53.08     41.85   400.00     65.65%
  Latency Distribution
     50%   15.14ms
     75%   94.82ms
     90%  237.92ms
     99%  760.11ms
  356293 requests in 30.10s, 372.73MB read
  Socket errors: connect 0, read 0, write 0, timeout 25
  Non-2xx or 3xx responses: 23
Requests/sec:  11836.38
Transfer/sec:     12.38MB

>>>>>>> result of pod wrk-worker-tn677
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    85.78ms  158.00ms   1.99s    89.78%
    Req/Sec    52.40     41.45   454.00     66.09%
  Latency Distribution
     50%   15.32ms
     75%   98.74ms
     90%  247.82ms
     99%  797.20ms
  348368 requests in 30.10s, 364.43MB read
  Socket errors: connect 0, read 0, write 0, timeout 16
  Non-2xx or 3xx responses: 37
Requests/sec:  11573.38
Transfer/sec:     12.11MB

>>>>>>> aggregated result of all pods
Total requests  : 2136601
Duration        : 30.099999999999998
Average RPS     : 70983.4219269103
```

## 3 instances

```
>>>>>>> result of pod wrk-worker-5vj07
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    61.93ms  106.79ms   1.45s    88.21%
    Req/Sec    76.91     63.62   505.00     70.67%
  Latency Distribution
     50%   11.42ms
     75%   78.74ms
     90%  189.59ms
     99%  496.68ms
  543919 requests in 30.10s, 569.02MB read
  Non-2xx or 3xx responses: 24
Requests/sec:  18070.46
Transfer/sec:     18.90MB

>>>>>>> result of pod wrk-worker-b533m
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    60.96ms  105.95ms   1.66s    88.41%
    Req/Sec    75.08     60.15   444.00     70.15%
  Latency Distribution
     50%   11.49ms
     75%   76.48ms
     90%  185.43ms
     99%  495.20ms
  537210 requests in 30.10s, 562.01MB read
  Non-2xx or 3xx responses: 17
Requests/sec:  17846.43
Transfer/sec:     18.67MB

>>>>>>> result of pod wrk-worker-ld9tz
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    62.34ms  108.34ms   1.82s    88.33%
    Req/Sec    77.39     64.68   540.00     71.78%
  Latency Distribution
     50%   11.34ms
     75%   78.95ms
     90%  190.18ms
     99%  505.15ms
  546496 requests in 30.10s, 571.72MB read
  Socket errors: connect 0, read 0, write 0, timeout 1
  Non-2xx or 3xx responses: 21
Requests/sec:  18155.75
Transfer/sec:     18.99MB

>>>>>>> result of pod wrk-worker-p3d99
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    59.97ms  104.46ms   1.36s    88.26%
    Req/Sec    81.61     67.45   560.00     70.07%
  Latency Distribution
     50%   10.62ms
     75%   75.31ms
     90%  184.41ms
     99%  487.31ms
  580106 requests in 30.10s, 606.88MB read
  Socket errors: connect 0, read 0, write 0, timeout 1
  Non-2xx or 3xx responses: 20
Requests/sec:  19271.68
Transfer/sec:     20.16MB

>>>>>>> result of pod wrk-worker-s7wjd
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    61.85ms  106.64ms   1.34s    88.22%
    Req/Sec    77.85     64.99   560.00     71.71%
  Latency Distribution
     50%   11.36ms
     75%   78.66ms
     90%  189.27ms
     99%  496.95ms
  550282 requests in 30.10s, 575.68MB read
  Non-2xx or 3xx responses: 24
Requests/sec:  18281.58
Transfer/sec:     19.13MB

>>>>>>> result of pod wrk-worker-tn677
Running 30s test @ http://35.186.249.71/
  300 threads and 300 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    62.57ms  108.18ms   1.77s    88.20%
    Req/Sec    77.72     64.58   520.00     71.20%
  Latency Distribution
     50%   11.30ms
     75%   79.35ms
     90%  191.82ms
     99%  502.20ms
  546889 requests in 30.10s, 572.13MB read
  Non-2xx or 3xx responses: 19
Requests/sec:  18168.90
Transfer/sec:     19.01MB

>>>>>>> aggregated result of all pods
Total requests  : 3304902
Duration        : 30.099999999999998
Average RPS     : 109797.40863787376
```

### 4 instances

Concurrency/thread changed to 500 `node run.js -- -c500 -t500 -d30s --latency http://35.186.249.71/` to generate proper pressure.

```
6 pods found: [ 'wrk-worker-5vj07',
  'wrk-worker-b533m',
  'wrk-worker-ld9tz',
  'wrk-worker-p3d99',
  'wrk-worker-s7wjd',
  'wrk-worker-tn677' ]
>>>>>>> result of pod wrk-worker-5vj07
Running 30s test @ http://35.186.249.71/
  500 threads and 500 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    87.41ms  161.33ms   1.98s    89.55%
    Req/Sec    62.93     56.34   626.00     76.10%
  Latency Distribution
     50%   14.29ms
     75%  105.27ms
     90%  256.82ms
     99%  793.91ms
  672644 requests in 30.10s, 703.66MB read
  Socket errors: connect 0, read 1, write 0, timeout 51
  Non-2xx or 3xx responses: 74
Requests/sec:  22346.00
Transfer/sec:     23.38MB

>>>>>>> result of pod wrk-worker-b533m
Running 30s test @ http://35.186.249.71/
  500 threads and 500 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    88.24ms  161.35ms   1.98s    89.51%
    Req/Sec    60.15     52.84   480.00     77.02%
  Latency Distribution
     50%   15.13ms
     75%  106.19ms
     90%  258.13ms
     99%  797.84ms
  662980 requests in 30.10s, 693.55MB read
  Socket errors: connect 0, read 0, write 0, timeout 48
  Non-2xx or 3xx responses: 79
Requests/sec:  22024.24
Transfer/sec:     23.04MB

>>>>>>> result of pod wrk-worker-ld9tz
Running 30s test @ http://35.186.249.71/
  500 threads and 500 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    86.83ms  162.12ms   2.00s    89.66%
    Req/Sec    64.35     57.53   545.00     78.59%
  Latency Distribution
     50%   14.23ms
     75%  102.83ms
     90%  255.07ms
     99%  802.16ms
  694605 requests in 30.10s, 726.64MB read
  Socket errors: connect 0, read 0, write 0, timeout 42
  Non-2xx or 3xx responses: 65
Requests/sec:  23075.75
Transfer/sec:     24.14MB

>>>>>>> result of pod wrk-worker-p3d99
Running 30s test @ http://35.186.249.71/
  500 threads and 500 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    88.96ms  164.74ms   1.97s    89.61%
    Req/Sec    61.81     55.33   470.00     76.56%
  Latency Distribution
     50%   14.38ms
     75%  106.79ms
     90%  260.82ms
     99%  810.97ms
  658080 requests in 30.10s, 688.44MB read
  Socket errors: connect 0, read 0, write 0, timeout 48
  Non-2xx or 3xx responses: 60
Requests/sec:  21861.61
Transfer/sec:     22.87MB

>>>>>>> result of pod wrk-worker-s7wjd
Running 30s test @ http://35.186.249.71/
  500 threads and 500 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    87.13ms  162.63ms   2.00s    89.65%
    Req/Sec    63.56     56.04   480.00     75.63%
  Latency Distribution
     50%   14.23ms
     75%  103.54ms
     90%  256.12ms
     99%  797.07ms
  681763 requests in 30.10s, 713.21MB read
  Socket errors: connect 0, read 0, write 0, timeout 52
  Non-2xx or 3xx responses: 57
Requests/sec:  22648.80
Transfer/sec:     23.69MB

>>>>>>> result of pod wrk-worker-tn677
Running 30s test @ http://35.186.249.71/
  500 threads and 500 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    85.47ms  158.42ms   1.97s    89.58%
    Req/Sec    64.28     57.39   595.00     78.63%
  Latency Distribution
     50%   14.15ms
     75%  102.18ms
     90%  251.18ms
     99%  781.34ms
  694484 requests in 30.10s, 726.51MB read
  Socket errors: connect 0, read 0, write 0, timeout 45
  Non-2xx or 3xx responses: 75
Requests/sec:  23072.48
Transfer/sec:     24.14MB

>>>>>>> aggregated result of all pods
Total requests  : 4064556
Duration        : 30.099999999999998
Average RPS     : 135035.0830564784
```

## Start cluster test

First, need to prepare the test dispatch/aggregate script by running `npm install`.

Then can use command `node run.js -- <command>` to start distributed test.

Example of wrk tests:

- test with paths.yaml and check debug information: `node run.js -- -c1 -t1 -d15s --latency -s multiple-paths.lua https://loganstaging-candidate.esna.com -- debug`
- test health check URI: `node run.js -- -c200 -t200 -d15s --latency -s multiple-paths.lua https://loganstaging-candidate.esna.com -- health.yaml`
- test with paths.yaml: `node run.js -- -c200 -t200 -d15s --latency -s multiple-paths.lua https://loganstaging-candidate.esna.com`
- test with customize paths: `node run.js -- -c200 -t200 -d15s -s multiple-paths.lua https://loganstaging-candidate.esna.com -- customize.yaml`

## Test Results

Load generator is installed on size 6 n1-standard-1 machine cluster.

### logan staging /health

Test `node run.js -- -c200 -t200 -d15s --latency -s multiple-paths.lua https://loganstaging-candidate.esna.com -- health.yaml` results:

```
6 pods found: [ 'wrk-worker-06wwt',
  'wrk-worker-7tdw7',
  'wrk-worker-fwz5m',
  'wrk-worker-gkl75',
  'wrk-worker-nmnss',
  'wrk-worker-qmwg1' ]
>>>>>>> result of pod wrk-worker-06wwt
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   313.56ms  232.62ms   1.95s    80.65%
    Req/Sec     5.02      3.57    50.00     63.39%
  Latency Distribution
     50%  257.75ms
     75%  385.98ms
     90%  605.92ms
     99%    1.19s 
  10847 requests in 15.10s, 1.79MB read
  Socket errors: connect 0, read 0, write 0, timeout 13
  Non-2xx or 3xx responses: 1
Requests/sec:    718.31
Transfer/sec:    121.38KB

>>>>>>> result of pod wrk-worker-7tdw7
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   311.09ms  223.39ms   1.89s    79.71%
    Req/Sec     4.95      3.71    70.00     64.59%
  Latency Distribution
     50%  259.49ms
     75%  387.32ms
     90%  597.74ms
     99%    1.13s 
  10863 requests in 15.10s, 1.79MB read
  Socket errors: connect 0, read 0, write 0, timeout 8
Requests/sec:    719.39
Transfer/sec:    121.54KB

>>>>>>> result of pod wrk-worker-fwz5m
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   309.00ms  223.83ms   1.86s    79.70%
    Req/Sec     5.01      3.98    90.00     63.93%
  Latency Distribution
     50%  256.87ms
     75%  387.62ms
     90%  593.93ms
     99%    1.15s 
  10914 requests in 15.10s, 1.80MB read
  Socket errors: connect 0, read 0, write 0, timeout 8
Requests/sec:    722.76
Transfer/sec:    122.11KB

>>>>>>> result of pod wrk-worker-gkl75
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   312.94ms  229.11ms   1.85s    79.80%
    Req/Sec     4.98      3.93    90.00     64.10%
  Latency Distribution
     50%  254.85ms
     75%  395.35ms
     90%  602.45ms
     99%    1.17s 
  10713 requests in 15.10s, 1.77MB read
  Socket errors: connect 0, read 0, write 0, timeout 16
Requests/sec:    709.43
Transfer/sec:    119.85KB

>>>>>>> result of pod wrk-worker-nmnss
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   307.76ms  239.15ms   2.00s    79.27%
    Req/Sec     5.30      6.28   170.00     98.25%
  Latency Distribution
     50%  253.37ms
     75%  387.41ms
     90%  601.02ms
     99%    1.21s 
  10748 requests in 15.10s, 1.77MB read
  Socket errors: connect 0, read 0, write 0, timeout 13
Requests/sec:    711.81
Transfer/sec:    120.26KB

>>>>>>> result of pod wrk-worker-qmwg1
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   325.10ms  237.34ms   1.93s    80.70%
    Req/Sec     4.72      3.24    40.00     65.10%
  Latency Distribution
     50%  264.85ms
     75%  415.64ms
     90%  617.15ms
     99%    1.24s 
  10031 requests in 15.10s, 1.66MB read
  Socket errors: connect 0, read 0, write 0, timeout 18
  Non-2xx or 3xx responses: 1
Requests/sec:    664.32
Transfer/sec:    112.25KB

>>>>>>> aggregated result of all pods
Total requests  : 64116
Duration        : 15.1
Average RPS     : 4246.092715231788
```

Spaces frontend pod `spaces-frontend-919055139-17vx4` is located on `gke-spaces-default-pool-84da82bf-t22d`. Max CPU usage is 37%, max network in 1.36M/s, network out 292k/s. Disk IO doesn't have significant change, stay on 10K/s write.

### logan staging multiple URLs

Test `node run.js -- -c200 -t200 -d15s --latency -s multiple-paths.lua https://loganstaging-candidate.esna.com` results:

```
6 pods found: [ 'wrk-worker-06wwt',
  'wrk-worker-7tdw7',
  'wrk-worker-fwz5m',
  'wrk-worker-gkl75',
  'wrk-worker-nmnss',
  'wrk-worker-qmwg1' ]
>>>>>>> result of pod wrk-worker-06wwt
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.10s   633.13ms   2.00s    50.87%
    Req/Sec     0.26      1.30    10.00     95.96%
  Latency Distribution
     50%    1.11s 
     75%    1.72s 
     90%    1.93s 
     99%    2.00s 
  892 requests in 15.10s, 2.91MB read
  Socket errors: connect 0, read 0, write 0, timeout 719
  Non-2xx or 3xx responses: 2
Requests/sec:     59.08
Transfer/sec:    197.69KB

>>>>>>> result of pod wrk-worker-7tdw7
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.21s   559.99ms   2.00s    58.70%
    Req/Sec     0.09      0.46     5.00     95.22%
  Latency Distribution
     50%    1.11s 
     75%    1.79s 
     90%    1.93s 
     99%    1.99s 
  858 requests in 15.10s, 2.84MB read
  Socket errors: connect 0, read 0, write 0, timeout 720
  Non-2xx or 3xx responses: 5
Requests/sec:     56.84
Transfer/sec:    192.68KB

>>>>>>> result of pod wrk-worker-fwz5m
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.24s   561.81ms   1.99s    60.26%
    Req/Sec     0.10      0.52     5.00     95.22%
  Latency Distribution
     50%    1.16s 
     75%    1.80s 
     90%    1.93s 
     99%    1.98s 
  878 requests in 15.10s, 2.87MB read
  Socket errors: connect 0, read 0, write 0, timeout 722
  Non-2xx or 3xx responses: 7
Requests/sec:     58.14
Transfer/sec:    194.94KB

>>>>>>> result of pod wrk-worker-gkl75
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.13s   605.74ms   2.00s    56.98%
    Req/Sec     0.22      1.15    10.00     96.51%
  Latency Distribution
     50%    1.13s 
     75%    1.69s 
     90%    1.92s 
     99%    1.98s 
  887 requests in 15.10s, 2.84MB read
  Socket errors: connect 0, read 0, write 0, timeout 715
  Non-2xx or 3xx responses: 7
Requests/sec:     58.75
Transfer/sec:    192.67KB

>>>>>>> result of pod wrk-worker-nmnss
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.17s   552.77ms   2.00s    57.76%
    Req/Sec     0.18      0.65     5.00     89.38%
  Latency Distribution
     50%    1.12s 
     75%    1.73s 
     90%    1.93s 
     99%    1.99s 
  819 requests in 15.10s, 2.26MB read
  Socket errors: connect 0, read 0, write 0, timeout 587
  Non-2xx or 3xx responses: 1
Requests/sec:     54.24
Transfer/sec:    153.06KB

>>>>>>> result of pod wrk-worker-qmwg1
Running 15s test @ https://loganstaging-candidate.esna.com
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   955.27ms  625.95ms   2.00s    54.87%
    Req/Sec     0.68      2.43    20.00     94.14%
  Latency Distribution
     50%  949.94ms
     75%    1.38s 
     90%    1.91s 
     99%    1.98s 
  894 requests in 15.10s, 2.42MB read
  Socket errors: connect 0, read 0, write 0, timeout 586
Requests/sec:     59.21
Transfer/sec:    163.84KB

>>>>>>> aggregated result of all pods
Total requests  : 5228
Duration        : 15.1
Average RPS     : 346.2251655629139
```

Spaces frontend pod `spaces-frontend-919055139-17vx4` is located on `gke-spaces-default-pool-84da82bf-t22d`. Max CPU usage is 42%, max network in 345K/s, network out 490k/s. Disk IO have significant change, increased to 106K/s write from 11K/s write.

Several tests results:

- 80 pods on 40 instances, concurrency 25
```
Total requests  : 2256973
Duration        : 300
Average RPS     : 7523.243333333333
Average Latency :
  50%: 66.11099999999999ms
  75%: 136.0115ms
  90%: 268.344ms
  99%: 726.3769999999998ms
Socket Error    : 0.030173156701475825%
Total Error     : 0.032432820419207496%

MongoDB CPU: 90.75%
Instance Group Average CPU: 86.26%
```
- 80 pods on 40 instances, concurrency 30
```
Total requests  : 2447816
Duration        : 300
Average RPS     : 8159.386666666666
Average Latency :
  50%: 70.71900000000001ms
  75%: 152.393ms
  90%: 298.025ms
  99%: 821.001ms
Socket Error    : 0.047389182847076744%
Total Error     : 0.04861476516208735%

MongoDB CPU: 91%
Instance Group Average CPU: 87.34%
```
- 80 pods on 40 instances, concurrency 35
```
Total requests  : 2486347
Duration        : 300
Average RPS     : 8287.823333333334
Average Latency :
  50%: 83.54799999999999ms
  75%: 186.00500000000002ms
  90%: 369.19199999999995ms
  99%: 967.5630000000001ms
Socket Error    : 0.023649152753014765%
Total Error     : 0.02445354570379758%

MongoDB CPU: 93.22%
Instance Group Average CPU: 89.08%
```
- 80 pods on 40 instances, concurrency 40
```
Total requests  : 2406067
Duration        : 300
Average RPS     : 8020.223333333333
Average Latency :
  50%: 100.94050000000001ms
  75%: 214.416ms
  90%: 393.48549999999994ms
  99%: 960.1725ms
Socket Error    : 0.033415528329011616%
Total Error     : 0.03520267723218015%

MongoDB CPU: 97.46%
Instance Group Average CPU: 89.28%
```
- 80 pods on 40 instances, concurrency 50
```
Total requests  : 2373232
Duration        : 300
Average RPS     : 7910.7733333333335
Average Latency :
  50%: 95.689ms
  75%: 252.72050000000004ms
  90%: 500.5045ms
  99%: 1208.5ms
Socket Error    : 0.1977050705535742%
Total Error     : 0.2017080504560869%

MongoDB CPU: 98.17%
Instance Group Average CPU: 89.24%
```

### logan staging multiple URLs with HPA enabled

Test `node run.js -- -c100 -t100 -d300s --latency -s multiple-paths.lua https://loganstaging-candidate.esna.com` results:

```
12 pods found: [ 'wrk-worker-35rs8',
  'wrk-worker-4g6xx',
  'wrk-worker-69sn5',
  'wrk-worker-6vzmm',
  'wrk-worker-f8s80',
  'wrk-worker-gn8xv',
  'wrk-worker-mlh4s',
  'wrk-worker-mrdwh',
  'wrk-worker-n49tk',
  'wrk-worker-rtp6m',
  'wrk-worker-sntfm',
  'wrk-worker-wvd5f' ]
>>>>>>> result of pod wrk-worker-35rs8
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   434.67ms  511.87ms   2.00s    81.26%
    Req/Sec     7.00      9.47   120.00     86.59%
  Latency Distribution
     50%  154.19ms
     75%  774.13ms
     90%    1.25s 
     99%    1.84s 
  60113 requests in 5.00m, 171.44MB read
  Socket errors: connect 0, read 0, write 0, timeout 2558
  Non-2xx or 3xx responses: 2666
Requests/sec:    200.31
Transfer/sec:    585.00KB

>>>>>>> result of pod wrk-worker-4g6xx
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   440.58ms  518.18ms   2.00s    81.27%
    Req/Sec     6.87      9.35   110.00     86.82%
  Latency Distribution
     50%  157.62ms
     75%  783.82ms
     90%    1.27s 
     99%    1.86s 
  57678 requests in 5.00m, 164.50MB read
  Socket errors: connect 0, read 0, write 0, timeout 2468
  Non-2xx or 3xx responses: 2580
Requests/sec:    192.20
Transfer/sec:    561.30KB

>>>>>>> result of pod wrk-worker-69sn5
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   435.44ms  514.20ms   2.00s    81.31%
    Req/Sec     6.92      9.30   111.00     86.58%
  Latency Distribution
     50%  151.70ms
     75%  774.96ms
     90%    1.26s 
     99%    1.84s 
  57725 requests in 5.00m, 164.49MB read
  Socket errors: connect 0, read 0, write 0, timeout 2526
  Non-2xx or 3xx responses: 2594
Requests/sec:    192.35
Transfer/sec:    561.29KB

>>>>>>> result of pod wrk-worker-6vzmm
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   437.76ms  517.67ms   2.00s    81.22%
    Req/Sec     6.96      9.34   111.00     86.21%
  Latency Distribution
     50%  149.35ms
     75%  780.27ms
     90%    1.26s 
     99%    1.86s 
  57788 requests in 5.00m, 164.74MB read
  Socket errors: connect 0, read 0, write 0, timeout 2533
  Non-2xx or 3xx responses: 2594
Requests/sec:    192.56
Transfer/sec:    562.13KB

>>>>>>> result of pod wrk-worker-f8s80
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   440.40ms  514.81ms   2.00s    81.27%
    Req/Sec     6.91      9.30   111.00     86.63%
  Latency Distribution
     50%  160.19ms
     75%  784.70ms
     90%    1.27s 
     99%    1.85s 
  59546 requests in 5.00m, 170.57MB read
  Socket errors: connect 0, read 0, write 0, timeout 2516
  Non-2xx or 3xx responses: 2352
Requests/sec:    198.42
Transfer/sec:    582.03KB

>>>>>>> result of pod wrk-worker-gn8xv
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   440.64ms  516.59ms   2.00s    81.19%
    Req/Sec     6.99      9.43   120.00     86.34%
  Latency Distribution
     50%  158.53ms
     75%  786.46ms
     90%    1.27s 
     99%    1.86s 
  59695 requests in 5.00m, 171.91MB read
  Socket errors: connect 0, read 1, write 0, timeout 2510
  Non-2xx or 3xx responses: 1966
Requests/sec:    198.92
Transfer/sec:    586.59KB

>>>>>>> result of pod wrk-worker-mlh4s
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   436.71ms  514.44ms   2.00s    81.21%
    Req/Sec     6.88      9.26   120.00     86.64%
  Latency Distribution
     50%  154.92ms
     75%  780.30ms
     90%    1.26s 
     99%    1.85s 
  58293 requests in 5.00m, 167.82MB read
  Socket errors: connect 0, read 0, write 0, timeout 2592
  Non-2xx or 3xx responses: 1971
Requests/sec:    194.24
Transfer/sec:    572.64KB

>>>>>>> result of pod wrk-worker-mrdwh
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   438.48ms  515.24ms   2.00s    81.19%
    Req/Sec     6.97      9.41   100.00     86.38%
  Latency Distribution
     50%  155.96ms
     75%  785.08ms
     90%    1.26s 
     99%    1.85s 
  59518 requests in 5.00m, 171.47MB read
  Socket errors: connect 0, read 0, write 0, timeout 2567
  Non-2xx or 3xx responses: 1920
Requests/sec:    198.33
Transfer/sec:    585.09KB

>>>>>>> result of pod wrk-worker-n49tk
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   434.27ms  516.26ms   2.00s    81.28%
    Req/Sec     6.90      9.30   121.00     86.58%
  Latency Distribution
     50%  149.32ms
     75%  774.49ms
     90%    1.26s 
     99%    1.85s 
  57377 requests in 5.00m, 164.97MB read
  Socket errors: connect 0, read 0, write 0, timeout 2586
  Non-2xx or 3xx responses: 1949
Requests/sec:    191.19
Transfer/sec:    562.91KB

>>>>>>> result of pod wrk-worker-rtp6m
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   437.98ms  517.70ms   2.00s    81.18%
    Req/Sec     6.95      9.46   111.00     86.56%
  Latency Distribution
     50%  152.85ms
     75%  782.07ms
     90%    1.27s 
     99%    1.85s 
  58115 requests in 5.00m, 167.87MB read
  Socket errors: connect 0, read 0, write 0, timeout 2601
  Non-2xx or 3xx responses: 1670
Requests/sec:    193.65
Transfer/sec:    572.81KB

>>>>>>> result of pod wrk-worker-sntfm
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   439.01ms  514.50ms   2.00s    81.10%
    Req/Sec     6.93      9.36   120.00     86.61%
  Latency Distribution
     50%  157.51ms
     75%  785.81ms
     90%    1.26s 
     99%    1.84s 
  59568 requests in 5.00m, 171.60MB read
  Socket errors: connect 0, read 0, write 0, timeout 2591
  Non-2xx or 3xx responses: 1932
Requests/sec:    198.49
Transfer/sec:    585.55KB

>>>>>>> result of pod wrk-worker-wvd5f
Running 5m test @ https://loganstaging-candidate.esna.com
  100 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   444.50ms  519.45ms   2.00s    81.19%
    Req/Sec     6.91      9.24   121.00     86.44%
  Latency Distribution
     50%  160.69ms
     75%  793.16ms
     90%    1.28s 
     99%    1.85s 
  58920 requests in 5.00m, 169.35MB read
  Socket errors: connect 0, read 0, write 0, timeout 2479
  Non-2xx or 3xx responses: 2042
Requests/sec:    196.34
Transfer/sec:    577.84KB

>>>>>>> aggregated result of all pods
Total requests  : 704336
Duration        : 300
Average RPS     : 2347.786666666667
```

Staging-candidate has hpa enabled, with min 10, max 18 replicas settings. During test, initially 10 replicas increased to 18.

### logan production multiple URLs: 2 instances

Test `node run.js -- -c200 -t200 -d15s --latency -s multiple-paths.lua https://spaces.zang.io` result:

```
6 pods found: [ 'wrk-worker-2kltz',
  'wrk-worker-6wfxs',
  'wrk-worker-7b173',
  'wrk-worker-fm0bb',
  'wrk-worker-tqz7k',
  'wrk-worker-w4rv0' ]
>>>>>>> result of pod wrk-worker-2kltz
Running 15s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.28s   340.75ms   1.93s    75.00%
    Req/Sec     0.04      0.22     2.00     97.00%
  Latency Distribution
     50%    1.24s 
     75%    1.52s 
     90%    1.73s 
     99%    1.92s 
  466 requests in 15.10s, 176.22KB read
  Socket errors: connect 0, read 0, write 0, timeout 310
Requests/sec:     30.86
Transfer/sec:     11.67KB

>>>>>>> result of pod wrk-worker-6wfxs
Running 15s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.09s   538.64ms   1.94s    58.64%
    Req/Sec     0.42      1.76    20.00     94.63%
  Latency Distribution
     50%    1.16s 
     75%    1.51s 
     90%    1.72s 
     99%    1.94s 
  485 requests in 15.10s, 208.61KB read
  Socket errors: connect 0, read 0, write 0, timeout 294
Requests/sec:     32.12
Transfer/sec:     13.82KB

>>>>>>> result of pod wrk-worker-7b173
Running 15s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.35s   533.39ms   1.99s    72.08%
    Req/Sec     0.20      1.07    10.00     96.76%
  Latency Distribution
     50%    1.64s 
     75%    1.69s 
     90%    1.73s 
     99%    1.98s 
  865 requests in 15.10s, 426.20KB read
  Socket errors: connect 0, read 0, write 0, timeout 600
Requests/sec:     57.29
Transfer/sec:     28.23KB

>>>>>>> result of pod wrk-worker-fm0bb
Running 15s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.18s   465.72ms   1.94s    61.99%
    Req/Sec     0.17      0.84    10.00     96.95%
  Latency Distribution
     50%    1.18s 
     75%    1.51s 
     90%    1.72s 
     99%    1.94s 
  459 requests in 15.10s, 200.00KB read
  Socket errors: connect 0, read 0, write 0, timeout 288
Requests/sec:     30.39
Transfer/sec:     13.24KB

>>>>>>> result of pod wrk-worker-tqz7k
Running 15s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.61s   272.61ms   1.99s    64.67%
    Req/Sec     0.00      0.05     1.00     99.75%
  Latency Distribution
     50%    1.69s 
     75%    1.72s 
     90%    1.97s 
     99%    1.99s 
  789 requests in 15.10s, 351.37KB read
  Socket errors: connect 0, read 0, write 0, timeout 622
Requests/sec:     52.25
Transfer/sec:     23.27KB

>>>>>>> result of pod wrk-worker-w4rv0
Running 15s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.50s   403.25ms   1.99s    70.21%
    Req/Sec     0.05      0.24     2.00     96.21%
  Latency Distribution
     50%    1.68s 
     75%    1.70s 
     90%    1.97s 
     99%    1.99s 
  871 requests in 15.10s, 425.48KB read
  Socket errors: connect 0, read 0, write 0, timeout 636
Requests/sec:     57.69
Transfer/sec:     28.18KB

>>>>>>> aggregated result of all pods
Total requests  : 3935
Duration        : 15.1
Average RPS     : 260.5960264900662
```

Spaces frontend instance group `instance-group-logan-production-201601041` has 2 instances and with autoscaling off.

- max CPU usage is 32%, 44%
- max network in 297K/s, 325K/s
- max network out 297K/s, 384K/s
- max disk IO 70.82K/s,331K/s
- mongodb op/s: 168.16 query, 69.34 command, 34.68 inserts
- mongodb connection: 60 => 66.67
- mongodb cpu time: 2.2% => 8.84%
- mongodb docs: 7 => 353.31 returned
- mongodb network out: 30K/s => 5.23M/s
- mongodb network in: 20K/s => 779.9K/s

### logan production multiple URLs: 4 instances

Test `node run.js -- -c200 -t200 -d30s --latency -s multiple-paths.lua https://spaces.zang.io` result:

```
6 pods found: [ 'wrk-worker-2kltz',
  'wrk-worker-6wfxs',
  'wrk-worker-7b173',
  'wrk-worker-fm0bb',
  'wrk-worker-tqz7k',
  'wrk-worker-w4rv0' ]
>>>>>>> result of pod wrk-worker-2kltz
Running 30s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.14s   349.61ms   1.98s    79.05%
    Req/Sec     0.17      0.38     1.00     82.58%
  Latency Distribution
     50%  959.85ms
     75%    1.32s 
     90%    1.77s 
     99%    1.97s 
  1068 requests in 30.10s, 1.06MB read
  Socket errors: connect 0, read 0, write 0, timeout 710
Requests/sec:     35.48
Transfer/sec:     36.19KB

>>>>>>> result of pod wrk-worker-6wfxs
Running 30s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.17s   354.44ms   2.00s    81.85%
    Req/Sec     0.15      0.36     1.00     85.05%
  Latency Distribution
     50%  964.83ms
     75%    1.44s 
     90%    1.76s 
     99%    1.98s 
  1018 requests in 30.10s, 0.96MB read
  Socket errors: connect 0, read 0, write 0, timeout 693
Requests/sec:     33.82
Transfer/sec:     32.55KB

>>>>>>> result of pod wrk-worker-7b173
Running 30s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.12s   641.78ms   1.99s    32.91%
    Req/Sec     0.30      0.78     3.00     87.80%
  Latency Distribution
     50%    1.17s 
     75%    1.88s 
     90%    1.93s 
     99%    1.99s 
  1156 requests in 30.10s, 0.98MB read
  Socket errors: connect 0, read 0, write 0, timeout 761
  Non-2xx or 3xx responses: 41
Requests/sec:     38.41
Transfer/sec:     33.38KB

>>>>>>> result of pod wrk-worker-fm0bb
Running 30s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.17s   349.23ms   2.00s    82.10%
    Req/Sec     0.15      0.36     1.00     84.88%
  Latency Distribution
     50%  964.74ms
     75%    1.44s 
     90%    1.76s 
     99%    1.98s 
  1032 requests in 30.10s, 0.96MB read
  Socket errors: connect 0, read 0, write 0, timeout 708
Requests/sec:     34.29
Transfer/sec:     32.63KB

>>>>>>> result of pod wrk-worker-tqz7k
Running 30s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.33s   586.04ms   2.00s    67.09%
    Req/Sec     0.15      0.56     3.00     92.96%
  Latency Distribution
     50%    1.34s 
     75%    1.90s 
     90%    1.93s 
     99%    1.99s 
  1051 requests in 30.10s, 845.41KB read
  Socket errors: connect 0, read 0, write 0, timeout 738
  Non-2xx or 3xx responses: 15
Requests/sec:     34.91
Transfer/sec:     28.08KB

>>>>>>> result of pod wrk-worker-w4rv0
Running 30s test @ https://spaces.zang.io
  200 threads and 200 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.28s   622.27ms   2.00s    48.99%
    Req/Sec     0.20      0.65     3.00     90.56%
  Latency Distribution
     50%    1.32s 
     75%    1.90s 
     90%    1.95s 
     99%    1.99s 
  1081 requests in 30.10s, 0.88MB read
  Socket errors: connect 0, read 0, write 0, timeout 734
  Non-2xx or 3xx responses: 28
Requests/sec:     35.92
Transfer/sec:     29.89KB

>>>>>>> aggregated result of all pods
Total requests  : 6406
Duration        : 30.099999999999998
Average RPS     : 212.82392026578074
```

Spaces frontend instance group `instance-group-logan-production-201601041` has 4 instances and with autoscaling off.

- max CPU usage is 41.45%, 52.11%, 0.7%, 0.8%
- max network in 437K/s, 334K/s
- max network out 411K/s, 344K/s
- max disk IO 98K/s, 60K/s
- mongodb op/s: 117 query, 15 command, 41.51 inserts
- mongodb connection: 60 => 66.67
- mongodb cpu time: 2.2% => 4.79%
- mongodb docs: 7 => 294.91 returned
- mongodb network out: 30K/s => 4.12M/s
- mongodb network in: 20K/s => 348.97K/s
- mongodb disk IO doesn't have signifant change, remains 40 blocks/sec.
- this time index usage has big difference:
  + index entry scanned: 6 => 9.87
  + document scanned: 200 => 3304

### logan production multiple URLs: 10 instances

Test `node run.js -- -c50 -t50 -d300s --latency -s multiple-paths.lua https://spaces.zang.io` result:

```
12 pods found: [ 'wrk-worker-2rw0w',
  'wrk-worker-3hlmn',
  'wrk-worker-5gb4j',
  'wrk-worker-6kgv8',
  'wrk-worker-l409m',
  'wrk-worker-lh36p',
  'wrk-worker-mkc5d',
  'wrk-worker-ml0cj',
  'wrk-worker-pvrjq',
  'wrk-worker-vz7tl',
  'wrk-worker-wnx5v',
  'wrk-worker-xqtbb' ]
>>>>>>> result of pod wrk-worker-2rw0w
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.00us    0.00us   0.00us    -nan%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    0.00us
     75%    0.00us
     90%    0.00us
     99%    0.00us
  280 requests in 5.00m, 712.33KB read
  Socket errors: connect 0, read 0, write 0, timeout 280
  Non-2xx or 3xx responses: 50
Requests/sec:      0.93
Transfer/sec:      2.37KB

>>>>>>> result of pod wrk-worker-3hlmn
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   302.56ms  176.49ms   1.97s    83.49%
    Req/Sec     4.12      2.89    90.00     84.94%
  Latency Distribution
     50%  252.09ms
     75%  342.64ms
     90%  510.40ms
     99%  990.13ms
  51342 requests in 5.00m, 162.84MB read
  Socket errors: connect 0, read 0, write 0, timeout 78
  Non-2xx or 3xx responses: 1296
Requests/sec:    171.08
Transfer/sec:    555.63KB

>>>>>>> result of pod wrk-worker-5gb4j
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.00us    0.00us   0.00us    -nan%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    0.00us
     75%    0.00us
     90%    0.00us
     99%    0.00us
  282 requests in 5.00m, 723.79KB read
  Socket errors: connect 0, read 0, write 0, timeout 282
  Non-2xx or 3xx responses: 49
Requests/sec:      0.94
Transfer/sec:      2.41KB

>>>>>>> result of pod wrk-worker-6kgv8
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.00us    0.00us   0.00us    -nan%
    Req/Sec     0.00      0.00     0.00      -nan%
  Latency Distribution
     50%    0.00us
     75%    0.00us
     90%    0.00us
     99%    0.00us
  0 requests in 5.00m, 0.00B read
Requests/sec:      0.00
Transfer/sec:       0.00B

>>>>>>> result of pod wrk-worker-l409m
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.00us    0.00us   0.00us    -nan%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    0.00us
     75%    0.00us
     90%    0.00us
     99%    0.00us
  285 requests in 5.00m, 728.64KB read
  Socket errors: connect 0, read 0, write 0, timeout 285
  Non-2xx or 3xx responses: 48
Requests/sec:      0.95
Transfer/sec:      2.43KB

>>>>>>> result of pod wrk-worker-lh36p
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.00us    0.00us   0.00us    -nan%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    0.00us
     75%    0.00us
     90%    0.00us
     99%    0.00us
  283 requests in 5.00m, 713.43KB read
  Socket errors: connect 0, read 0, write 0, timeout 283
  Non-2xx or 3xx responses: 50
Requests/sec:      0.94
Transfer/sec:      2.38KB

>>>>>>> result of pod wrk-worker-mkc5d
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   578.16ms  268.33ms   2.00s    80.94%
    Req/Sec     1.74      2.27    90.00     96.91%
  Latency Distribution
     50%  501.85ms
     75%  657.07ms
     90%  932.86ms
     99%    1.53s 
  25858 requests in 5.00m, 82.28MB read
  Socket errors: connect 0, read 0, write 0, timeout 150
  Non-2xx or 3xx responses: 465
Requests/sec:     86.17
Transfer/sec:    280.76KB

>>>>>>> result of pod wrk-worker-ml0cj
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   288.42ms  179.08ms   1.99s    83.37%
    Req/Sec     4.54      3.06    90.00     80.55%
  Latency Distribution
     50%  236.51ms
     75%  332.43ms
     90%  499.25ms
     99%  984.44ms
  54158 requests in 5.00m, 172.33MB read
  Socket errors: connect 0, read 0, write 0, timeout 92
  Non-2xx or 3xx responses: 1349
Requests/sec:    180.47
Transfer/sec:    588.04KB

>>>>>>> result of pod wrk-worker-pvrjq
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.00us    0.00us   0.00us    -nan%
    Req/Sec     0.00      0.00     0.00    100.00%
  Latency Distribution
     50%    0.00us
     75%    0.00us
     90%    0.00us
     99%    0.00us
  277 requests in 5.00m, 718.52KB read
  Socket errors: connect 0, read 0, write 0, timeout 277
  Non-2xx or 3xx responses: 50
Requests/sec:      0.92
Transfer/sec:      2.39KB

>>>>>>> result of pod wrk-worker-vz7tl
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     0.00us    0.00us   0.00us    -nan%
    Req/Sec     0.00      0.00     0.00      -nan%
  Latency Distribution
     50%    0.00us
     75%    0.00us
     90%    0.00us
     99%    0.00us
  0 requests in 5.00m, 0.00B read
Requests/sec:      0.00
Transfer/sec:       0.00B

>>>>>>> result of pod wrk-worker-wnx5v
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   280.88ms  172.46ms   1.96s    84.32%
    Req/Sec     4.60      3.04    90.00     81.79%
  Latency Distribution
     50%  231.05ms
     75%  319.39ms
     90%  477.73ms
     99%  963.81ms
  55630 requests in 5.00m, 176.94MB read
  Socket errors: connect 0, read 0, write 0, timeout 91
  Non-2xx or 3xx responses: 1409
Requests/sec:    185.37
Transfer/sec:    603.75KB

>>>>>>> result of pod wrk-worker-xqtbb
Running 5m test @ https://spaces.zang.io
  50 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   578.36ms  269.27ms   2.00s    81.32%
    Req/Sec     1.75      2.36    80.00     96.89%
  Latency Distribution
     50%  501.10ms
     75%  657.36ms
     90%  938.17ms
     99%    1.55s 
  25842 requests in 5.00m, 82.23MB read
  Socket errors: connect 0, read 0, write 0, timeout 160
  Non-2xx or 3xx responses: 465
Requests/sec:     86.11
Transfer/sec:    280.59KB

>>>>>>> aggregated result of all pods
Total requests  : 214237
Duration        : 300
Average RPS     : 714.1233333333333
```

Spaces frontend instance group `instance-group-logan-production-201601041` has 10 instances and with autoscaling off.

- max CPU usage:
  + 4 nodes didn't get traffic, cpu remains about 2%
  + 4 nodes hits 100%
  + 2 nodes remains about 66%
- mongodb op/s: 504 query, 333 command, 101 inserts
- mongodb cpu time: 2.2% => 78.88%
- mongodb docs: 7 => 1318 returned
- mongodb network out: 30K/s => 13.88M/s
- mongodb network in: 20K/s => 2.17M/s
- mongodb disk IO: write 424 blocks/s, read 36 blocks/s

## Conculusion

- spaces production server currently may handle 260 rps, average latency is about 1.3s, which is worse than spaces staging
- spaces production servers has significant timeout connections
- the 4 instances spaces production test is invalid because there are 2 instances don't get any traffice. This should be caused by client IP session affinity.
