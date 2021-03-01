# Test with YCSB

[Yahoo! Cloud Serving Benchmark](https://github.com/brianfrankcooper/YCSB/wiki) [fork](https://github.com/jackesna/YCSB)

The goal of the YCSB project is to develop a framework and common set of workloads for evaluating the performance of different “key-value” and “cloud” serving stores. The project comprises two things:

- The YCSB Client, an extensible workload generator
- The Core workloads, a set of workload scenarios to be executed by the generator

## Deploy load generator machine

### Manually Install YCSB on one testing machine

```
sudo apt-get install default-jdk -y
wget http://httpd-mirror.sergal.org/apache/maven/maven-3/3.5.0/binaries/apache-maven-3.5.0-bin.tar.gz
tar zxvf apache-maven-3.5.0-bin.tar.gz

# add below line to ~/.bash_profile
# export PATH=${PATH}:/home/tjia/apache-maven-3.5.0/bin

source ~/.bash_profile
git clone https://github.com/jackesna/YCSB.git
cd YCSB

mvn -pl com.yahoo.ycsb:mongodb-binding -am clean package
```

### Using deploy script to create load generator cluster

Use command `./deploy.sh [workload_file]` to deploy a workload file to cluster. `workload_file` is optional. Use `./deploy.sh -h` to check available options.

Wait until the ycsb-workers are created.

IMPORTANT: make sure to delete the cluster after test.

### deploy script options

- `-p|--project`: project name, default is `onesnastaging`.
- `-c|--cluster`: cluster name, default is `loadtest-ycsb`.
- `-s|--size`: cluster size, default is 3. This will decide how many instances/workers you have to generate load.
- `-m|--machine`: machine type, default is `n1-standard-1`. You can use better machine for example `n1-standard-4`.
- `-z|--zone`: cluster zone, default is `us-central1-a`.

## Test using single load generator

### Test on Local MongoDB

Test `tjia@tfeng-mac:~/Projects/tjia/Logan/load-test/ycsb-0.12.0$ ./bin/ycsb load mongodb -s  -P workloads/workloada -p recordcount=10000000 -threads 8 -p mongodb.url="mongodb://localhost:27017/test"` result:

```
[OVERALL], RunTime(ms), 437086.0
[OVERALL], Throughput(ops/sec), 22878.792731865124
[TOTAL_GCS_PS_Scavenge], Count, 3556.0
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 2523.0
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.5772319406249571
[TOTAL_GCS_PS_MarkSweep], Count, 0.0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 0.0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0
[TOTAL_GCs], Count, 3556.0
[TOTAL_GC_TIME], Time(ms), 2523.0
[TOTAL_GC_TIME_%], Time(%), 0.5772319406249571
[CLEANUP], Operations, 8.0
[CLEANUP], AverageLatency(us), 2121.875
[CLEANUP], MinLatency(us), 1.0
[CLEANUP], MaxLatency(us), 16943.0
[CLEANUP], 95thPercentileLatency(us), 16943.0
[CLEANUP], 99thPercentileLatency(us), 16943.0
[INSERT], Operations, 1.0E7
[INSERT], AverageLatency(us), 338.2119526
[INSERT], MinLatency(us), 82.0
[INSERT], MaxLatency(us), 1024511.0
[INSERT], 95thPercentileLatency(us), 541.0
[INSERT], 99thPercentileLatency(us), 1248.0
[INSERT], Return=OK, 10000000
```

Test `./bin/ycsb run mongodb-async -s  -P workloads/workloada -p operationcount=10000000 -threads 8 -p mongodb.url="mongodb://localhost:27017/test"` result:

```
[OVERALL], RunTime(ms), 426187.0
[OVERALL], Throughput(ops/sec), 23463.878532193616
[TOTAL_GCS_PS_Scavenge], Count, 3836.0
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 3198.0
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.7503748354595519
[TOTAL_GCS_PS_MarkSweep], Count, 30.0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 334.0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.07836935429752667
[TOTAL_GCs], Count, 3866.0
[TOTAL_GC_TIME], Time(ms), 3532.0
[TOTAL_GC_TIME_%], Time(%), 0.8287441897570784
[READ], Operations, 4998463.0
[READ], AverageLatency(us), 299.4424374052584
[READ], MinLatency(us), 61.0
[READ], MaxLatency(us), 247295.0
[READ], 95thPercentileLatency(us), 455.0
[READ], 99thPercentileLatency(us), 647.0
[READ], Return=OK, 4998463
[CLEANUP], Operations, 8.0
[CLEANUP], AverageLatency(us), 216.875
[CLEANUP], MinLatency(us), 3.0
[CLEANUP], MaxLatency(us), 1710.0
[CLEANUP], 95thPercentileLatency(us), 1710.0
[CLEANUP], 99thPercentileLatency(us), 1710.0
[UPDATE], Operations, 5001537.0
[UPDATE], AverageLatency(us), 377.1531887097906
[UPDATE], MinLatency(us), 101.0
[UPDATE], MaxLatency(us), 247167.0
[UPDATE], 95thPercentileLatency(us), 541.0
[UPDATE], 99thPercentileLatency(us), 794.0
[UPDATE], Return=OK, 5001537
```

### Test atlas M0 instance from GCE n1-standard-8

Test `./bin/ycsb load mongodb -s  -P workloads/workloada -p recordcount=1000000 -threads 8 -p mongodb.url="mongodb://<user>:<password>@cluster0-shard-00-00-wjwxv.mongodb.net:27017,cluster0-shard-00-01-wjwxv.mongodb.net:27017,cluster0-shard-00-02-wjwxv.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin" -p table=ycsbtest` 

- pending

### Test mlab logan-dev from GCE n1-standard-8

Backup database `mongodump --host ds035786.mlab.com:35786 -u <user> -p <password> --authenticationDatabase logan-dev --db logan-dev --out ./backup`.
To restore a single collection from backup `mongorestore --host ds035786.mlab.com:35786 -u <user> -p <password> --authenticationDatabase logan-dev --collection loadtesting --db logan-dev backup/logan-dev/loadtesting.bson`.

`logan-dev` Server Information:
- Cloud: AWS us-east-1
- Plan: Sandbox
- Memory: shared
- Version: 3.4.7
- Engine: MMAPv1

Because of the db quota limitation, the test records are limited to 200K. Test `./bin/ycsb load mongodb -s  -P workloads/workloada -p recordcount=200000 -threads 8 -p mongodb.url="mongodb://<user>:<password>@ds035786.mlab.com:35786/logan-dev?authSource=logan-dev" -p table=ycsbtest` result:

```
[OVERALL], RunTime(ms), 759317
[OVERALL], Throughput(ops/sec), 263.39460330797283
[TOTAL_GCS_PS_Scavenge], Count, 24
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 62
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.008165232702547157
[TOTAL_GCS_PS_MarkSweep], Count, 0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0
[TOTAL_GCs], Count, 24
[TOTAL_GC_TIME], Time(ms), 62
[TOTAL_GC_TIME_%], Time(%), 0.008165232702547157
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 998.625
[CLEANUP], MinLatency(us), 1
[CLEANUP], MaxLatency(us), 7975
[CLEANUP], 95thPercentileLatency(us), 7975
[CLEANUP], 99thPercentileLatency(us), 7975
[CLEANUP], 1, 4.0
[CLEANUP], 2, 2.0
[CLEANUP], 7, 1.0
[CLEANUP], 7975, 1.0
[INSERT], Operations, 200000
[INSERT], AverageLatency(us), 29881.72216
[INSERT], MinLatency(us), 27328
[INSERT], MaxLatency(us), 1511423
[INSERT], 95thPercentileLatency(us), 30639
[INSERT], 99thPercentileLatency(us), 59839
[INSERT], Return=OK, 200000
```

Test `./bin/ycsb run mongodb -s  -P workloads/workloada -p operationcount=100000 -threads 8 -p mongodb.url="mongodb://<user>:<password>@ds035786.mlab.com:35786/logan-dev?authSource=logan-dev" -p table=ycsbtest` result:

```
[OVERALL], RunTime(ms), 357828
[OVERALL], Throughput(ops/sec), 279.4638764993237
[TOTAL_GCS_PS_Scavenge], Count, 16
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 43
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.01201694668947092
[TOTAL_GCS_PS_MarkSweep], Count, 0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0
[TOTAL_GCs], Count, 16
[TOTAL_GC_TIME], Time(ms), 43
[TOTAL_GC_TIME_%], Time(%), 0.01201694668947092
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 985.25
[CLEANUP], MinLatency(us), 1
[CLEANUP], MaxLatency(us), 7863
[CLEANUP], 95thPercentileLatency(us), 7863
[CLEANUP], 99thPercentileLatency(us), 7863
[READ], Operations, 49995
[READ], AverageLatency(us), 28462.609460946096
[READ], MinLatency(us), 27296
[READ], MaxLatency(us), 722431
[READ], 95thPercentileLatency(us), 29455
[READ], 99thPercentileLatency(us), 36543
[READ], Return=OK, 49995
[UPDATE], Operations, 50005
[UPDATE], AverageLatency(us), 28514.85379462054
[UPDATE], MinLatency(us), 27296
[UPDATE], MaxLatency(us), 721407
[UPDATE], 95thPercentileLatency(us), 29615
[UPDATE], 99thPercentileLatency(us), 37023
[UPDATE], Return=OK, 50005
```

### Test mlab logan-staging from GCE n1-standard-8

Backup database `mongodump --host ds061474.mlab.com:61474 -u <user> -p <password> --authenticationDatabase logan-staging --db logan-staging --out ./backup`.
To restore a single collection from backup `mongorestore --host ds061474.mlab.com:61474 -u <user> -p <password> --authenticationDatabase logan-staging --collection loadtesting --db logan-staging backup/logan-staging/loadtesting.bson`.

`logan-staging` Server Information:
- Cloud: GCP us-central1
- Plan: Sandbox
- Memory: shared
- Version: 3.4.7
- Engine: MMAPv1

Because of the db quota limitation, the test records are limited to 200K. Test `./bin/ycsb load mongodb -s  -P workloads/workloada -p recordcount=200000 -threads 8 -p mongodb.url="mongodb://<user>:<password>@ds061474.mlab.com:61474/logan-staging?authSource=logan-staging" -p table=ycsbtest` result:

```
[OVERALL], RunTime(ms), 39401
[OVERALL], Throughput(ops/sec), 4162.3309053069715
[TOTAL_GCS_PS_Scavenge], Count, 19
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 50
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.12690033247887111
[TOTAL_GCS_PS_MarkSweep], Count, 0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0
[TOTAL_GCs], Count, 19
[TOTAL_GC_TIME], Time(ms), 50
[TOTAL_GC_TIME_%], Time(%), 0.12690033247887111
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 964.375
[CLEANUP], MinLatency(us), 0
[CLEANUP], MaxLatency(us), 7707
[CLEANUP], 95thPercentileLatency(us), 7707
[CLEANUP], 99thPercentileLatency(us), 7707
[CLEANUP], 0, 3.0
[CLEANUP], 1, 2.0
[CLEANUP], 3, 1.0
[CLEANUP], 4, 1.0
[CLEANUP], 7707, 1.0
[INSERT-FAILED], Operations, 8
[INSERT-FAILED], AverageLatency(us), 39291.75
[INSERT-FAILED], MinLatency(us), 7032
[INSERT-FAILED], MaxLatency(us), 254975
[INSERT-FAILED], 95thPercentileLatency(us), 254975
[INSERT-FAILED], 99thPercentileLatency(us), 254975
[INSERT], Operations, 164000
[INSERT], AverageLatency(us), 1891.2363841463414
[INSERT], MinLatency(us), 426
[INSERT], MaxLatency(us), 709119
[INSERT], 95thPercentileLatency(us), 2967
[INSERT], 99thPercentileLatency(us), 7515
[INSERT], Return=OK, 164000
[INSERT], Return=ERROR, 8
```

Test `./bin/ycsb run mongodb -s  -P workloads/workloada -p operationcount=100000 -threads 8 -p mongodb.url="mongodb://<user>:<password>@ds061474.mlab.com:61474/logan-staging?authSource=logan-staging" -p table=ycsbtest` result:

```
[OVERALL], RunTime(ms), 28648
[OVERALL], Throughput(ops/sec), 3490.6450712091596
[TOTAL_GCS_PS_Scavenge], Count, 15
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 53
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.18500418877408545
[TOTAL_GCS_PS_MarkSweep], Count, 0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0
[TOTAL_GCs], Count, 15
[TOTAL_GC_TIME], Time(ms), 53
[TOTAL_GC_TIME_%], Time(%), 0.18500418877408545
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 995.375
[CLEANUP], MinLatency(us), 1
[CLEANUP], MaxLatency(us), 7951
[CLEANUP], 95thPercentileLatency(us), 7951
[CLEANUP], 99thPercentileLatency(us), 7951
[CLEANUP], 1, 5.0
[CLEANUP], 2, 1.0
[CLEANUP], 6, 1.0
[CLEANUP], 7951, 1.0
[READ], Operations, 49849
[READ], AverageLatency(us), 2231.3178799975926
[READ], MinLatency(us), 395
[READ], MaxLatency(us), 285695
[READ], 95thPercentileLatency(us), 2919
[READ], 99thPercentileLatency(us), 6151
[READ], Return=OK, 49849
[UPDATE], Operations, 50151
[UPDATE], AverageLatency(us), 2241.250224322546
[UPDATE], MinLatency(us), 425
[UPDATE], MaxLatency(us), 275711
[UPDATE], 95thPercentileLatency(us), 2935
[UPDATE], 99thPercentileLatency(us), 6303
[UPDATE], Return=OK, 50151
```

## Test mlab logan-production from GCE n1-standard-8

Backup database `mongodump --host "rs-ds035495/ds035495-a0.hwm48.fleet.mongolab.com:35495,ds035495-a1.hwm48.fleet.mongolab.com:35495" -u <user> -p <password> --authenticationDatabase logan-production --db logan-production  --out ./backup`.
To restore to localhost `mongorestore --nsInclude "logan-production.*" ./backup`.

`logan-production` server information:
- Cloud: AWS us-east-1
- Version: 3.0.15
- Engine: MMAPv1
- Plan: M2 standard
- Disk: 60G SSD

Test `./bin/ycsb load mongodb -s  -P workloads/workloada -p recordcount=1000000 -threads 8 -p mongodb.url='mongodb://<user>:<password>@ds035495-a0.hwm48.fleet.mongolab.com:35495,ds035495-a1.hwm48.fleet.mongolab.com:35495/logan-production?replicaSet=rs-ds035495' -p table=ycsbtest` result:

```
[OVERALL], RunTime(ms), 3579879
[OVERALL], Throughput(ops/sec), 279.3390502863365
[TOTAL_GCS_PS_Scavenge], Count, 235
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 293
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.00818463417338966
[TOTAL_GCS_PS_MarkSweep], Count, 0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0
[TOTAL_GCs], Count, 235
[TOTAL_GC_TIME], Time(ms), 293
[TOTAL_GC_TIME_%], Time(%), 0.00818463417338966
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 957.375
[CLEANUP], MinLatency(us), 1
[CLEANUP], MaxLatency(us), 7643
[CLEANUP], 95thPercentileLatency(us), 7643
[CLEANUP], 99thPercentileLatency(us), 7643
[CLEANUP], 1, 1.0
[CLEANUP], 2, 5.0
[CLEANUP], 6, 1.0
[CLEANUP], 7643, 1.0
[INSERT], Operations, 1000000
[INSERT], AverageLatency(us), 28611.97608
[INSERT], MinLatency(us), 27376
[INSERT], MaxLatency(us), 678399
[INSERT], 95thPercentileLatency(us), 29599
[INSERT], 99thPercentileLatency(us), 37695
[INSERT], Return=OK, 1000000
```

- Server regular CPU is about 2.5%
- During test, CPU reached about 7.5%. (There was a spike about 40%, but didn't last long, and may be more related. Need next test to confirm.)
- Disk IO peak is about 7K block per second.
- Memory usage was increased from 6.23G to 8.23G.
- Network In 3.89M/s, Out 3.24M/s

Test `./bin/ycsb run mongodb -s  -P workloads/workloada -p operationcount=1000000 -threads 8 -p mongodb.url="mongodb://<user>:<password>@ds061474.mlab.com:61474/logan-staging?authSource=logan-staging" -p table=ycsbtest` result:

- pending, too slow to run test

## Start cluster test

First, need to prepare the test dispatch/aggregate script by running `npm install`.

Then can use command `node run.js -- <command>` to start distributed test.

Example of wrk tests:

- load workload database: `node run.js -- load mongodb -s -P workloads/workloada -p recordcount=10000 -threads 8 -p mongodb.url="mongodb://somewhere:27017/test"`
- run workload: `node run.js -- run mongodb -s -P workloads/workloada -p recordcount=10000 -threads 8 -p mongodb.url="mongodb://somewhere:27017/test"`

### Test mlab logan-staging from cluster

YCSB Cluster: default setting (n1-standard-1 * 3)

`node run.js -- load mongodb -s -P workloads/workloada -p recordcount=200000 -threads 3 -p table=ycsbtest -p mongodb.url="mongodb://<user>:<password>@ds061474.mlab.com:61474/logan-staging?authSource=logan-staging"` Result:

```
3 pods found: [ 'ycsb-worker-bgq0p', 'ycsb-worker-hdjnb', 'ycsb-worker-xfflg' ]
>>>>>>> result of pod ycsb-worker-bgq0p
mongo client connection created with mongodb://<user>:<password>@ds061474.mlab.com:61474/logan-staging?authSource=logan-staging
[OVERALL], RunTime(ms), 21930
[OVERALL], Throughput(ops/sec), 2407.34154126767
[TOTAL_GCS_MarkSweepCompact], Count, 0
[TOTAL_GC_TIME_MarkSweepCompact], Time(ms), 0
[TOTAL_GC_TIME_%_MarkSweepCompact], Time(%), 0.0
[TOTAL_GCS_Copy], Count, 42
[TOTAL_GC_TIME_Copy], Time(ms), 78
[TOTAL_GC_TIME_%_Copy], Time(%), 0.35567715458276333
[TOTAL_GCs], Count, 42
[TOTAL_GC_TIME], Time(ms), 78
[TOTAL_GC_TIME_%], Time(%), 0.35567715458276333
[CLEANUP], Operations, 3
[CLEANUP], AverageLatency(us), 2345.0
[CLEANUP], MinLatency(us), 0
[CLEANUP], MaxLatency(us), 7031
[CLEANUP], 95thPercentileLatency(us), 7031
[CLEANUP], 99thPercentileLatency(us), 7031
[CLEANUP], 0, 1.0
[CLEANUP], 5, 1.0
[CLEANUP], 7031, 1.0
[INSERT-FAILED], Operations, 3
[INSERT-FAILED], AverageLatency(us), 77957.33333333333
[INSERT-FAILED], MinLatency(us), 11848
[INSERT-FAILED], MaxLatency(us), 209023
[INSERT-FAILED], 95thPercentileLatency(us), 209023
[INSERT-FAILED], 99thPercentileLatency(us), 209023
[INSERT-FAILED], 11855, 1.0
[INSERT-FAILED], 13063, 1.0
[INSERT-FAILED], 209023, 1.0
[INSERT], Operations, 52793
[INSERT], AverageLatency(us), 1188.7176709033395
[INSERT], MinLatency(us), 388
[INSERT], MaxLatency(us), 460287
[INSERT], 95thPercentileLatency(us), 2117
[INSERT], 99thPercentileLatency(us), 7091
[INSERT], Return=OK, 52793
[INSERT], Return=ERROR, 3

>>>>>>> result of pod ycsb-worker-hdjnb
mongo client connection created with mongodb://<user>:<password>@ds061474.mlab.com:61474/logan-staging?authSource=logan-staging
[OVERALL], RunTime(ms), 22903
[OVERALL], Throughput(ops/sec), 2586.910011788849
[TOTAL_GCS_MarkSweepCompact], Count, 0
[TOTAL_GC_TIME_MarkSweepCompact], Time(ms), 0
[TOTAL_GC_TIME_%_MarkSweepCompact], Time(%), 0.0
[TOTAL_GCS_Copy], Count, 47
[TOTAL_GC_TIME_Copy], Time(ms), 79
[TOTAL_GC_TIME_%_Copy], Time(%), 0.34493297821246127
[TOTAL_GCs], Count, 47
[TOTAL_GC_TIME], Time(ms), 79
[TOTAL_GC_TIME_%], Time(%), 0.34493297821246127
[CLEANUP], Operations, 3
[CLEANUP], AverageLatency(us), 1921.0
[CLEANUP], MinLatency(us), 0
[CLEANUP], MaxLatency(us), 5759
[CLEANUP], 95thPercentileLatency(us), 5759
[CLEANUP], 99thPercentileLatency(us), 5759
[CLEANUP], 0, 1.0
[CLEANUP], 5, 1.0
[CLEANUP], 5759, 1.0
[INSERT-FAILED], Operations, 3
[INSERT-FAILED], AverageLatency(us), 12900.0
[INSERT-FAILED], MinLatency(us), 11032
[INSERT-FAILED], MaxLatency(us), 13983
[INSERT-FAILED], 95thPercentileLatency(us), 13983
[INSERT-FAILED], 99thPercentileLatency(us), 13983
[INSERT-FAILED], 11039, 1.0
[INSERT-FAILED], 13687, 1.0
[INSERT-FAILED], 13983, 1.0
[INSERT], Operations, 59248
[INSERT], AverageLatency(us), 1120.7571057250877
[INSERT], MinLatency(us), 380
[INSERT], MaxLatency(us), 510719
[INSERT], 95thPercentileLatency(us), 1994
[INSERT], 99thPercentileLatency(us), 6375
[INSERT], Return=OK, 59248
[INSERT], Return=ERROR, 3

>>>>>>> result of pod ycsb-worker-xfflg
mongo client connection created with mongodb://<user>:<password>@ds061474.mlab.com:61474/logan-staging?authSource=logan-staging
[OVERALL], RunTime(ms), 21876
[OVERALL], Throughput(ops/sec), 2375.1599926860486
[TOTAL_GCS_MarkSweepCompact], Count, 0
[TOTAL_GC_TIME_MarkSweepCompact], Time(ms), 0
[TOTAL_GC_TIME_%_MarkSweepCompact], Time(%), 0.0
[TOTAL_GCS_Copy], Count, 42
[TOTAL_GC_TIME_Copy], Time(ms), 78
[TOTAL_GC_TIME_%_Copy], Time(%), 0.35655512890839275
[TOTAL_GCs], Count, 42
[TOTAL_GC_TIME], Time(ms), 78
[TOTAL_GC_TIME_%], Time(%), 0.35655512890839275
[CLEANUP], Operations, 3
[CLEANUP], AverageLatency(us), 1885.6666666666667
[CLEANUP], MinLatency(us), 1
[CLEANUP], MaxLatency(us), 5651
[CLEANUP], 95thPercentileLatency(us), 5651
[CLEANUP], 99thPercentileLatency(us), 5651
[CLEANUP], 1, 1.0
[CLEANUP], 6, 1.0
[CLEANUP], 5651, 1.0
[INSERT-FAILED], Operations, 3
[INSERT-FAILED], AverageLatency(us), 8818.0
[INSERT-FAILED], MinLatency(us), 6740
[INSERT-FAILED], MaxLatency(us), 10415
[INSERT-FAILED], 95thPercentileLatency(us), 10415
[INSERT-FAILED], 99thPercentileLatency(us), 10415
[INSERT-FAILED], 6743, 1.0
[INSERT-FAILED], 9303, 1.0
[INSERT-FAILED], 10415, 1.0
[INSERT], Operations, 51959
[INSERT], AverageLatency(us), 1215.1693258145847
[INSERT], MinLatency(us), 412
[INSERT], MaxLatency(us), 477951
[INSERT], 95thPercentileLatency(us), 2183
[INSERT], 99thPercentileLatency(us), 7103
[INSERT], Return=OK, 51959
[INSERT], Return=ERROR, 3

>>>>>>> aggregated result of all pods
Total operations      : 164000
Average duration      : 22.236333333333334s
Average ops (reverse) : 7375.316673912065
Average ops per pod   : 2456.470515247522
Total ops             : 7369.411545742567 <== check this
```

`node run.js -- run mongodb -s -P workloads/workloada -p operationcount=100000 -threads 8 -p table=ycsbtest -p mongodb.url="mongodb://<user>:<password>@ds061474.mlab.com:61474/logan-staging?authSource=logan-staging"`

```
3 pods found: [ 'ycsb-worker-bgq0p', 'ycsb-worker-hdjnb', 'ycsb-worker-xfflg' ]
>>>>>>> result of pod ycsb-worker-bgq0p
mongo client connection created with mongodb://<user>:<password>@ds061474.mlab.com:61474/logan-staging?authSource=logan-staging
[OVERALL], RunTime(ms), 52321
[OVERALL], Throughput(ops/sec), 1911.2784541579863
[TOTAL_GCS_MarkSweepCompact], Count, 0
[TOTAL_GC_TIME_MarkSweepCompact], Time(ms), 0
[TOTAL_GC_TIME_%_MarkSweepCompact], Time(%), 0.0
[TOTAL_GCS_Copy], Count, 110
[TOTAL_GC_TIME_Copy], Time(ms), 212
[TOTAL_GC_TIME_%_Copy], Time(%), 0.40519103228149306
[TOTAL_GCs], Count, 110
[TOTAL_GC_TIME], Time(ms), 212
[TOTAL_GC_TIME_%], Time(%), 0.40519103228149306
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 2273.25
[CLEANUP], MinLatency(us), 1
[CLEANUP], MaxLatency(us), 18175
[CLEANUP], 95thPercentileLatency(us), 18175
[CLEANUP], 99thPercentileLatency(us), 18175
[CLEANUP], 1, 1.0
[CLEANUP], 2, 5.0
[CLEANUP], 7, 1.0
[CLEANUP], 18175, 1.0
[READ], Operations, 49884
[READ], AverageLatency(us), 4030.4839227006655
[READ], MinLatency(us), 400
[READ], MaxLatency(us), 957439
[READ], 95thPercentileLatency(us), 7023
[READ], 99thPercentileLatency(us), 13703
[READ], Return=OK, 49884
[UPDATE], Operations, 50116
[UPDATE], AverageLatency(us), 4061.689759757363
[UPDATE], MinLatency(us), 420
[UPDATE], MaxLatency(us), 961023
[UPDATE], 95thPercentileLatency(us), 6935
[UPDATE], 99thPercentileLatency(us), 12631
[UPDATE], Return=OK, 50116

>>>>>>> result of pod ycsb-worker-hdjnb
mongo client connection created with mongodb://<user>:<password>@ds061474.mlab.com:61474/logan-staging?authSource=logan-staging
[OVERALL], RunTime(ms), 52411
[OVERALL], Throughput(ops/sec), 1907.9964129667437
[TOTAL_GCS_MarkSweepCompact], Count, 0
[TOTAL_GC_TIME_MarkSweepCompact], Time(ms), 0
[TOTAL_GC_TIME_%_MarkSweepCompact], Time(%), 0.0
[TOTAL_GCS_Copy], Count, 111
[TOTAL_GC_TIME_Copy], Time(ms), 285
[TOTAL_GC_TIME_%_Copy], Time(%), 0.5437789776955219
[TOTAL_GCs], Count, 111
[TOTAL_GC_TIME], Time(ms), 285
[TOTAL_GC_TIME_%], Time(%), 0.5437789776955219
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 2869.0
[CLEANUP], MinLatency(us), 1
[CLEANUP], MaxLatency(us), 22943
[CLEANUP], 95thPercentileLatency(us), 22943
[CLEANUP], 99thPercentileLatency(us), 22943
[CLEANUP], 1, 3.0
[CLEANUP], 2, 3.0
[CLEANUP], 7, 1.0
[CLEANUP], 22943, 1.0
[READ], Operations, 50105
[READ], AverageLatency(us), 4051.8212553637363
[READ], MinLatency(us), 387
[READ], MaxLatency(us), 1090559
[READ], 95thPercentileLatency(us), 7095
[READ], 99thPercentileLatency(us), 14991
[READ], Return=OK, 50105
[UPDATE], Operations, 49895
[UPDATE], AverageLatency(us), 4019.8858402645556
[UPDATE], MinLatency(us), 401
[UPDATE], MaxLatency(us), 1096703
[UPDATE], 95thPercentileLatency(us), 7107
[UPDATE], 99thPercentileLatency(us), 13407
[UPDATE], Return=OK, 49895

>>>>>>> result of pod ycsb-worker-xfflg
mongo client connection created with mongodb://<user>:<password>@ds061474.mlab.com:61474/logan-staging?authSource=logan-staging
[OVERALL], RunTime(ms), 53444
[OVERALL], Throughput(ops/sec), 1871.1174313299903
[TOTAL_GCS_MarkSweepCompact], Count, 0
[TOTAL_GC_TIME_MarkSweepCompact], Time(ms), 0
[TOTAL_GC_TIME_%_MarkSweepCompact], Time(%), 0.0
[TOTAL_GCS_Copy], Count, 110
[TOTAL_GC_TIME_Copy], Time(ms), 211
[TOTAL_GC_TIME_%_Copy], Time(%), 0.39480577801062794
[TOTAL_GCs], Count, 110
[TOTAL_GC_TIME], Time(ms), 211
[TOTAL_GC_TIME_%], Time(%), 0.39480577801062794
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 2590.0
[CLEANUP], MinLatency(us), 1
[CLEANUP], MaxLatency(us), 20703
[CLEANUP], 95thPercentileLatency(us), 20703
[CLEANUP], 99thPercentileLatency(us), 20703
[CLEANUP], 1, 4.0
[CLEANUP], 2, 2.0
[CLEANUP], 16, 1.0
[CLEANUP], 20703, 1.0
[READ], Operations, 50115
[READ], AverageLatency(us), 4106.980744288137
[READ], MinLatency(us), 421
[READ], MaxLatency(us), 1033727
[READ], 95thPercentileLatency(us), 7151
[READ], 99thPercentileLatency(us), 13783
[READ], Return=OK, 50115
[UPDATE], Operations, 49885
[UPDATE], AverageLatency(us), 4107.96995088704
[UPDATE], MinLatency(us), 420
[UPDATE], MaxLatency(us), 1065983
[UPDATE], 95thPercentileLatency(us), 7251
[UPDATE], 99thPercentileLatency(us), 12935
[UPDATE], Return=OK, 49885

>>>>>>> aggregated result of all pods
Total operations      : 300000
Average duration      : 52.72533333333333s
Average ops (reverse) : 5689.864454784544
Average ops per pod   : 1896.7974328182402
Total ops             : 5690.392298454721 <== check this
```
