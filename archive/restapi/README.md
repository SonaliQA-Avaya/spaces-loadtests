# Test Restful API Performance

## Prepare Test Environment

- `sudo apt-get update -y`
- `sudo apt-get install -y git make build-essential libssl-dev unzip`
- `sudo ulimit -c -m -s -t unlimited`

### Install WRK

- `git clone https://github.com/wg/wrk.git`
- `cd wrk`
- `make`
- `sudo mv wrk /usr/local/bin`

### Install LUA support

- `apt-get install -y luajit lua5.1 liblua5.1-dev`
- Install [LUA Rocks](https://github.com/luarocks/luarocks/wiki/Download)
  - `wget https://keplerproject.github.io/luarocks/releases/luarocks-2.4.3.tar.gz`
  - `tar zxvf luarocks-2.4.3.tar.gz`
  - `cd luarocks-2.4.3`
  - `./configure`
  - `make build`
  - `sudo make install`
- `luarocks install yaml`

## Test commands

- test with debug information: `wrk -c1 -t1 -d15s -s multiple-paths.lua https://loganstaging-candidate.esna.com -- debug`
- test /health: `wrk -c600 -t600 -d15s -s multiple-paths.lua https://loganstaging-candidate.esna.com -- health.yaml`
- test multiple paths: `wrk -c600 -t600 -d15s -s multiple-paths.lua https://loganstaging-candidate.esna.com`

NOTE: do not use `debug` option on large amount of requests.

## Start test

### Test /health

Test `wrk -c600 -t600 -d15s -s multiple-paths.lua https://loganstaging-candidate.esna.com -- health.yaml` result:

```
Running 15s test @ https://loganstaging-candidate.esna.com
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   172.49ms  137.28ms   1.74s    81.66%
    Req/Sec     8.50      5.24   160.00     79.05%
  60020 requests in 15.10s, 9.90MB read
Requests/sec:   3974.22
Transfer/sec:    671.43KB
```

Result 2:

```
Running 15s test @ https://loganstaging-candidate.esna.com
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   153.11ms  131.52ms   1.80s    86.43%
    Req/Sec     9.47      5.18   151.00     77.41%
  68938 requests in 15.10s, 11.37MB read
Requests/sec:   4564.86
Transfer/sec:    771.21KB
```

### Test multiple URLs

Test `wrk -c600 -t600 -s15s -s multiple-paths.lua https://loganstaging-candidate.esna.com` result 1:

```
Running 15s test @ https://loganstaging-candidate.esna.com
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   968.71ms  336.28ms   2.00s    67.78%
    Req/Sec     0.62      0.82    20.00     95.54%
  8805 requests in 15.10s, 27.46MB read
  Socket errors: connect 0, read 0, write 0, timeout 327
  Non-2xx or 3xx responses: 1
Requests/sec:    583.02
Transfer/sec:      1.82MB
```

Result 2:

```
Running 15s test @ https://loganstaging-candidate.esna.com
  600 threads and 600 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.32s   454.34ms   2.00s    70.60%
    Req/Sec     0.41      1.71    30.00     96.33%
  5468 requests in 15.10s, 10.21MB read
  Socket errors: connect 0, read 0, write 0, timeout 1234
Requests/sec:    362.06
Transfer/sec:    692.41KB
```
