# Test with YCSB

[Yahoo! Cloud Serving Benchmark](https://github.com/brianfrankcooper/YCSB/wiki)

The goal of the YCSB project is to develop a framework and common set of workloads for evaluating the performance of different “key-value” and “cloud” serving stores. The project comprises two things:

- The YCSB Client, an extensible workload generator
- The Core workloads, a set of workload scenarios to be executed by the generator

## Test on Local MongoDB

```
tjia@tfeng-mac:~/Projects/tjia/Logan/load-test/ycsb-0.12.0$ ./bin/ycsb load mongodb -s  -P workloads/workloada -p recordcount=10000000 -threads 8 -p mongodb.url="mongodb://localhost:27017/test"
java -cp /Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/conf:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/conf:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/core-0.12.0.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/HdrHistogram-2.1.4.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/htrace-core4-4.1.0-incubating.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/jackson-core-asl-1.9.4.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/jackson-mapper-asl-1.9.4.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/logback-classic-1.1.2.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/logback-core-1.1.2.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/mongo-java-driver-3.0.3.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/mongodb-async-driver-2.0.1.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/mongodb-binding-0.12.0.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/slf4j-api-1.6.4.jar com.yahoo.ycsb.Client -db com.yahoo.ycsb.db.MongoDbClient -s -P workloads/workloada -p recordcount=10000000 -threads 8 -p mongodb.url=mongodb://localhost:27017/test -load
YCSB Client 0.12.0
Command line: -db com.yahoo.ycsb.db.MongoDbClient -s -P workloads/workloada -p recordcount=10000000 -threads 8 -p mongodb.url=mongodb://localhost:27017/test -load
Loading workload...
Starting test.
2017-10-06 09:42:26:050 0 sec: 0 operations; est completion in 0 seconds
2017-10-06 09:42:36:012 10 sec: 0 operations; est completion in 106751991167300 days 15 hours
mongo client connection created with mongodb://localhost:27017/test
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
2017-10-06 09:42:46:010 20 sec: 178103 operations; 17813.86 current ops/sec; est completion in 18 minutes [INSERT: Count=178127, Max=161791, Min=82, Avg=426.72, 90=861, 99=3971, 99.9=10959, 99.99=48511]
2017-10-06 09:42:56:007 30 sec: 492894 operations; 31488.55 current ops/sec; est completion in 9 minutes [INSERT: Count=314773, Max=158719, Min=82, Avg=251.45, 90=280, 99=1031, 99.9=5287, 99.99=18815]
2017-10-06 09:43:06:006 39 sec: 786363 operations; 29349.83 current ops/sec; est completion in 7 minutes [INSERT: Count=293472, Max=36863, Min=95, Avg=270.2, 90=321, 99=836, 99.9=5879, 99.99=16975]
2017-10-06 09:43:16:006 49 sec: 1068739 operations; 28237.6 current ops/sec; est completion in 6 minutes [INSERT: Count=282380, Max=44767, Min=106, Avg=280.62, 90=347, 99=918, 99.9=4295, 99.99=18815]
2017-10-06 09:43:26:005 59 sec: 1334147 operations; 26543.45 current ops/sec; est completion in 6 minutes [INSERT: Count=265402, Max=38143, Min=121, Avg=298.78, 90=368, 99=848, 99.9=9655, 99.99=21823]
2017-10-06 09:43:36:005 69 sec: 1596489 operations; 26234.2 current ops/sec; est completion in 6 minutes [INSERT: Count=262349, Max=276223, Min=103, Avg=302.28, 90=336, 99=715, 99.9=10511, 99.99=48447]
2017-10-06 09:43:46:005 79 sec: 1873810 operations; 27732.1 current ops/sec; est completion in 5 minutes [INSERT: Count=277317, Max=35743, Min=126, Avg=285.83, 90=361, 99=689, 99.9=4827, 99.99=17279]
2017-10-06 09:43:56:004 89 sec: 2111528 operations; 23774.18 current ops/sec; est completion in 5 minutes [INSERT: Count=237716, Max=212607, Min=97, Avg=333.82, 90=383, 99=948, 99.9=10671, 99.99=64351]
2017-10-06 09:44:06:004 99 sec: 2381951 operations; 27042.3 current ops/sec; est completion in 5 minutes [INSERT: Count=270428, Max=28159, Min=127, Avg=293.28, 90=395, 99=759, 99.9=4043, 99.99=14239]
2017-10-06 09:44:16:004 109 sec: 2668169 operations; 28624.66 current ops/sec; est completion in 5 minutes [INSERT: Count=286216, Max=108351, Min=91, Avg=276.95, 90=337, 99=680, 99.9=5963, 99.99=25759]
2017-10-06 09:44:26:006 119 sec: 2927700 operations; 25945.32 current ops/sec; est completion in 4 minutes [INSERT: Count=259532, Max=40799, Min=130, Avg=305.75, 90=380, 99=943, 99.9=5127, 99.99=13471]
2017-10-06 09:44:36:003 129 sec: 3164636 operations; 23700.71 current ops/sec; est completion in 4 minutes [INSERT: Count=236936, Max=202111, Min=102, Avg=334.97, 90=433, 99=1044, 99.9=4987, 99.99=47295]
2017-10-06 09:44:46:003 139 sec: 3393324 operations; 22871.09 current ops/sec; est completion in 4 minutes [INSERT: Count=228688, Max=274175, Min=99, Avg=347.27, 90=432, 99=1159, 99.9=10111, 99.99=61407]
2017-10-06 09:44:56:002 149 sec: 3631428 operations; 23810.4 current ops/sec; est completion in 4 minutes [INSERT: Count=238101, Max=44767, Min=108, Avg=333.44, 90=419, 99=1419, 99.9=10327, 99.99=27519]
2017-10-06 09:45:06:002 159 sec: 3901354 operations; 26992.6 current ops/sec; est completion in 4 minutes [INSERT: Count=269928, Max=46559, Min=104, Avg=293.88, 90=368, 99=873, 99.9=6443, 99.99=29519]
2017-10-06 09:45:16:002 169 sec: 4077055 operations; 17571.86 current ops/sec; est completion in 4 minutes [INSERT: Count=175699, Max=1024511, Min=83, Avg=452.77, 90=568, 99=1583, 99.9=15671, 99.99=154239]
2017-10-06 09:45:26:001 179 sec: 4363635 operations; 28658 current ops/sec; est completion in 3 minutes [INSERT: Count=286588, Max=19503, Min=103, Avg=276.66, 90=373, 99=773, 99.9=4005, 99.99=12959]
2017-10-06 09:45:36:001 189 sec: 4615592 operations; 25195.7 current ops/sec; est completion in 3 minutes [INSERT: Count=251946, Max=86143, Min=123, Avg=314.96, 90=394, 99=1084, 99.9=6127, 99.99=19199]
2017-10-06 09:45:46:001 199 sec: 4861322 operations; 24575.46 current ops/sec; est completion in 3 minutes [INSERT: Count=245733, Max=232319, Min=120, Avg=323.05, 90=406, 99=1040, 99.9=4659, 99.99=12399]
2017-10-06 09:45:56:000 209 sec: 5062063 operations; 20074.1 current ops/sec; est completion in 3 minutes [INSERT: Count=200746, Max=366591, Min=116, Avg=395.9, 90=509, 99=1535, 99.9=10423, 99.99=33471]
2017-10-06 09:46:06:000 219 sec: 5252928 operations; 19086.5 current ops/sec; est completion in 3 minutes [INSERT: Count=190862, Max=756735, Min=123, Avg=416.53, 90=567, 99=1559, 99.9=12231, 99.99=40127]
2017-10-06 09:46:16:000 229 sec: 5499251 operations; 24634.76 current ops/sec; est completion in 3 minutes [INSERT: Count=246317, Max=362239, Min=99, Avg=322.26, 90=397, 99=1105, 99.9=7111, 99.99=36127]
2017-10-06 09:46:25:999 239 sec: 5661937 operations; 16268.6 current ops/sec; est completion in 3 minutes [INSERT: Count=162687, Max=391935, Min=87, Avg=489.2, 90=559, 99=3483, 99.9=25887, 99.99=163199]
2017-10-06 09:46:35:999 249 sec: 5902580 operations; 24064.3 current ops/sec; est completion in 2 minutes [INSERT: Count=240649, Max=95551, Min=89, Avg=329.91, 90=432, 99=1329, 99.9=8679, 99.99=27151]
2017-10-06 09:46:45:998 259 sec: 6145611 operations; 24305.53 current ops/sec; est completion in 2 minutes [INSERT: Count=243036, Max=54175, Min=105, Avg=326.58, 90=417, 99=1196, 99.9=7227, 99.99=19023]
2017-10-06 09:46:56:001 269 sec: 6373333 operations; 22765.37 current ops/sec; est completion in 2 minutes [INSERT: Count=227709, Max=24799, Min=98, Avg=348.85, 90=457, 99=1425, 99.9=6747, 99.99=16183]
2017-10-06 09:47:05:998 279 sec: 6593598 operations; 22033.11 current ops/sec; est completion in 2 minutes [INSERT: Count=220261, Max=164735, Min=124, Avg=360.43, 90=496, 99=1126, 99.9=5579, 99.99=15871]
2017-10-06 09:47:16:002 289 sec: 6804887 operations; 21131.01 current ops/sec; est completion in 2 minutes [INSERT: Count=211395, Max=584703, Min=97, Avg=376.1, 90=465, 99=1371, 99.9=13047, 99.99=68031]
2017-10-06 09:47:26:000 299 sec: 7047919 operations; 24298.34 current ops/sec; est completion in 2 minutes [INSERT: Count=242926, Max=116799, Min=119, Avg=325.37, 90=399, 99=1202, 99.9=8479, 99.99=24527]
2017-10-06 09:47:36:000 309 sec: 7291981 operations; 24406.2 current ops/sec; est completion in 1 minutes [INSERT: Count=244066, Max=241407, Min=97, Avg=326.76, 90=391, 99=1030, 99.9=13807, 99.99=91199]
2017-10-06 09:47:45:996 319 sec: 7536405 operations; 24449.73 current ops/sec; est completion in 1 minutes [INSERT: Count=244432, Max=40447, Min=122, Avg=324.62, 90=426, 99=1091, 99.9=6523, 99.99=20335]
2017-10-06 09:47:56:000 329 sec: 7780793 operations; 24429.03 current ops/sec; est completion in 1 minutes [INSERT: Count=244389, Max=119359, Min=101, Avg=324.94, 90=419, 99=1124, 99.9=6175, 99.99=18911]
2017-10-06 09:48:05:996 339 sec: 8010391 operations; 22968.99 current ops/sec; est completion in 1 minutes [INSERT: Count=229593, Max=108927, Min=110, Avg=345.77, 90=459, 99=1241, 99.9=6371, 99.99=30479]
2017-10-06 09:48:15:995 349 sec: 8203269 operations; 19289.73 current ops/sec; est completion in 1 minutes [INSERT: Count=192873, Max=873983, Min=108, Avg=412.24, 90=460, 99=1433, 99.9=13863, 99.99=73023]
2017-10-06 09:48:25:995 359 sec: 8400019 operations; 19675 current ops/sec; est completion in 1 minutes [INSERT: Count=196754, Max=202623, Min=94, Avg=403.95, 90=536, 99=1358, 99.9=22047, 99.99=64127]
2017-10-06 09:48:35:995 369 sec: 8611038 operations; 21101.9 current ops/sec; est completion in 1 minutes [INSERT: Count=211017, Max=156543, Min=115, Avg=376.57, 90=496, 99=1465, 99.9=13055, 99.99=42847]
2017-10-06 09:48:45:994 379 sec: 8817480 operations; 20646.26 current ops/sec; est completion in 51 seconds [INSERT: Count=206437, Max=884735, Min=82, Avg=384.15, 90=405, 99=1139, 99.9=14719, 99.99=133759]
2017-10-06 09:48:55:994 389 sec: 9058024 operations; 24054.4 current ops/sec; est completion in 41 seconds [INSERT: Count=240550, Max=119359, Min=101, Avg=330.87, 90=405, 99=1307, 99.9=8191, 99.99=22799]
2017-10-06 09:49:05:994 399 sec: 9292387 operations; 23436.3 current ops/sec; est completion in 31 seconds [INSERT: Count=234365, Max=40895, Min=123, Avg=338.77, 90=452, 99=1167, 99.9=6295, 99.99=17007]
2017-10-06 09:49:15:993 409 sec: 9509771 operations; 21740.57 current ops/sec; est completion in 22 seconds [INSERT: Count=217384, Max=31599, Min=99, Avg=365.5, 90=475, 99=1631, 99.9=9743, 99.99=19295]
2017-10-06 09:49:25:993 419 sec: 9676455 operations; 16668.4 current ops/sec; est completion in 15 seconds [INSERT: Count=166684, Max=149759, Min=126, Avg=477.29, 90=698, 99=1653, 99.9=14015, 99.99=41567]
2017-10-06 09:49:35:996 429 sec: 9866978 operations; 19046.59 current ops/sec; est completion in 6 seconds [INSERT: Count=190523, Max=172543, Min=106, Avg=417.46, 90=476, 99=1826, 99.9=25215, 99.99=87295]
2017-10-06 09:49:43:093 437 sec: 10000000 operations; 18743.41 current ops/sec; [CLEANUP: Count=8, Max=16943, Min=1, Avg=2121.88, 90=33, 99=16943, 99.9=16943, 99.99=16943] [INSERT: Count=133014, Max=290047, Min=102, Avg=382.99, 90=531, 99=1420, 99.9=17279, 99.99=28159]
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

```
tjia@tfeng-mac:~/Projects/tjia/Logan/load-test/ycsb-0.12.0$ ./bin/ycsb load mongodb-async -s  -P workloads/workloada -p recordcount=10000000 -threads 8 -p mongodb.url="mongodb://localhost:27017/test"
java -cp /Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/conf:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/conf:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/core-0.12.0.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/HdrHistogram-2.1.4.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/htrace-core4-4.1.0-incubating.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/jackson-core-asl-1.9.4.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/jackson-mapper-asl-1.9.4.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/logback-classic-1.1.2.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/logback-core-1.1.2.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/mongo-java-driver-3.0.3.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/mongodb-async-driver-2.0.1.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/mongodb-binding-0.12.0.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/slf4j-api-1.6.4.jar com.yahoo.ycsb.Client -db com.yahoo.ycsb.db.AsyncMongoDbClient -s -P workloads/workloada -p recordcount=10000000 -threads 8 -p mongodb.url=mongodb://localhost:27017/test -load
YCSB Client 0.12.0
Command line: -db com.yahoo.ycsb.db.AsyncMongoDbClient -s -P workloads/workloada -p recordcount=10000000 -threads 8 -p mongodb.url=mongodb://localhost:27017/test -load
Loading workload...
Starting test.
2017-10-06 09:55:55:736 0 sec: 0 operations; est completion in 0 seconds 
mongo connection created with mongodb://localhost:27017/test
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
2017-10-06 09:56:05:735 9 sec: 236682 operations; 23670.57 current ops/sec; est completion in 6 minutes [INSERT: Count=236737, Max=120319, Min=82, Avg=333.17, 90=418, 99=1194, 99.9=9159, 99.99=20863] 
2017-10-06 09:56:15:735 19 sec: 477674 operations; 24099.2 current ops/sec; est completion in 6 minutes [INSERT: Count=240946, Max=53599, Min=80, Avg=329.66, 90=416, 99=1330, 99.9=9895, 99.99=20735] 
2017-10-06 09:56:25:735 29 sec: 724847 operations; 24717.3 current ops/sec; est completion in 6 minutes [INSERT: Count=247174, Max=29679, Min=87, Avg=321.32, 90=399, 99=826, 99.9=7439, 99.99=16623] 
2017-10-06 09:56:35:734 39 sec: 966684 operations; 24186.12 current ops/sec; est completion in 6 minutes [INSERT: Count=241837, Max=27887, Min=83, Avg=328.41, 90=422, 99=731, 99.9=9695, 99.99=22687] 
2017-10-06 09:56:45:734 49 sec: 1188505 operations; 22182.1 current ops/sec; est completion in 6 minutes [INSERT: Count=221811, Max=152191, Min=82, Avg=357.38, 90=441, 99=947, 99.9=12031, 99.99=31647] 
2017-10-06 09:56:55:735 59 sec: 1419016 operations; 23048.8 current ops/sec; est completion in 6 minutes [INSERT: Count=230520, Max=107391, Min=85, Avg=345.52, 90=419, 99=899, 99.9=9863, 99.99=46111] 
2017-10-06 09:57:05:733 69 sec: 1654555 operations; 23558.61 current ops/sec; est completion in 5 minutes [INSERT: Count=235538, Max=37663, Min=91, Avg=337.19, 90=425, 99=893, 99.9=7595, 99.99=21375] 
2017-10-06 09:57:15:733 79 sec: 1889175 operations; 23462 current ops/sec; est completion in 5 minutes [INSERT: Count=234624, Max=34143, Min=90, Avg=338.57, 90=426, 99=805, 99.9=8543, 99.99=25743] 
2017-10-06 09:57:25:733 89 sec: 2131362 operations; 24218.7 current ops/sec; est completion in 5 minutes [INSERT: Count=242185, Max=31423, Min=87, Avg=327.98, 90=415, 99=767, 99.9=7767, 99.99=20079] 
2017-10-06 09:57:35:732 99 sec: 2380032 operations; 24869.49 current ops/sec; est completion in 5 minutes [INSERT: Count=248670, Max=36191, Min=85, Avg=319.43, 90=405, 99=761, 99.9=7103, 99.99=19183] 
2017-10-06 09:57:45:736 110 sec: 2583349 operations; 20323.57 current ops/sec; est completion in 5 minutes [INSERT: Count=203314, Max=1069055, Min=83, Avg=391.29, 90=429, 99=1029, 99.9=9871, 99.99=60959] 
2017-10-06 09:57:55:733 119 sec: 2830122 operations; 24684.71 current ops/sec; est completion in 5 minutes [INSERT: Count=246777, Max=56191, Min=81, Avg=321.9, 90=389, 99=815, 99.9=10871, 99.99=25599] 
2017-10-06 09:58:05:731 129 sec: 3067919 operations; 23784.46 current ops/sec; est completion in 4 minutes [INSERT: Count=237793, Max=27759, Min=87, Avg=333.98, 90=420, 99=804, 99.9=7987, 99.99=17007] 
2017-10-06 09:58:15:731 139 sec: 3289642 operations; 22172.3 current ops/sec; est completion in 4 minutes [INSERT: Count=221728, Max=223743, Min=83, Avg=358.42, 90=445, 99=938, 99.9=9863, 99.99=30063] 
2017-10-06 09:58:25:731 149 sec: 3526976 operations; 23733.4 current ops/sec; est completion in 4 minutes [INSERT: Count=237333, Max=24943, Min=86, Avg=334.69, 90=435, 99=781, 99.9=6115, 99.99=12959] 
2017-10-06 09:58:35:731 159 sec: 3771002 operations; 24402.6 current ops/sec; est completion in 4 minutes [INSERT: Count=244023, Max=49855, Min=85, Avg=325.56, 90=418, 99=788, 99.9=7395, 99.99=20751] 
2017-10-06 09:58:45:730 169 sec: 3970576 operations; 19959.4 current ops/sec; est completion in 4 minutes [INSERT: Count=199576, Max=361215, Min=101, Avg=398.22, 90=488, 99=989, 99.9=6491, 99.99=15039] 
2017-10-06 09:58:55:730 179 sec: 4157019 operations; 18644.3 current ops/sec; est completion in 4 minutes [INSERT: Count=186441, Max=404479, Min=81, Avg=426.67, 90=463, 99=2095, 99.9=20047, 99.99=94527] 
2017-10-06 09:59:05:729 189 sec: 4384577 operations; 22758.08 current ops/sec; est completion in 4 minutes [INSERT: Count=227558, Max=21951, Min=86, Avg=349.13, 90=455, 99=1054, 99.9=6955, 99.99=15231] 
2017-10-06 09:59:15:729 199 sec: 4557582 operations; 17300.5 current ops/sec; est completion in 3 minutes [INSERT: Count=173004, Max=350975, Min=100, Avg=459.72, 90=526, 99=1353, 99.9=19647, 99.99=43935] 
2017-10-06 09:59:25:729 209 sec: 4724186 operations; 16660.4 current ops/sec; est completion in 3 minutes [INSERT: Count=166602, Max=37503, Min=126, Avg=477.48, 90=622, 99=2185, 99.9=13623, 99.99=29535] 
2017-10-06 09:59:35:729 219 sec: 4913445 operations; 18925.9 current ops/sec; est completion in 3 minutes [INSERT: Count=189262, Max=30447, Min=88, Avg=420.1, 90=577, 99=1392, 99.9=7479, 99.99=17535] 
2017-10-06 09:59:45:730 229 sec: 5077070 operations; 16360.86 current ops/sec; est completion in 3 minutes [INSERT: Count=163627, Max=528383, Min=118, Avg=486.33, 90=620, 99=1757, 99.9=11167, 99.99=34815] 
2017-10-06 09:59:55:728 239 sec: 5251278 operations; 17424.28 current ops/sec; est completion in 3 minutes [INSERT: Count=174204, Max=316415, Min=106, Avg=456.4, 90=548, 99=1412, 99.9=10919, 99.99=78015] 
2017-10-06 10:00:05:732 249 sec: 5444246 operations; 19298.73 current ops/sec; est completion in 3 minutes [INSERT: Count=193028, Max=271871, Min=85, Avg=412.15, 90=442, 99=3265, 99.9=17535, 99.99=51359] 
2017-10-06 10:00:15:730 259 sec: 5671791 operations; 22749.95 current ops/sec; est completion in 3 minutes [INSERT: Count=227488, Max=36095, Min=88, Avg=349.26, 90=448, 99=990, 99.9=8879, 99.99=16831] 
2017-10-06 10:00:25:727 269 sec: 5856715 operations; 18496.1 current ops/sec; est completion in 3 minutes [INSERT: Count=184924, Max=29855, Min=111, Avg=429.79, 90=556, 99=1302, 99.9=6935, 99.99=16671] 
2017-10-06 10:00:35:726 279 sec: 6036132 operations; 17943.49 current ops/sec; est completion in 3 minutes [INSERT: Count=179418, Max=17087, Min=123, Avg=443.19, 90=582, 99=1289, 99.9=6743, 99.99=13359] 
2017-10-06 10:00:45:726 289 sec: 6206122 operations; 16999 current ops/sec; est completion in 2 minutes [INSERT: Count=169990, Max=463103, Min=94, Avg=467.9, 90=574, 99=1269, 99.9=6863, 99.99=25663] 
2017-10-06 10:00:55:727 299 sec: 6401685 operations; 19554.34 current ops/sec; est completion in 2 minutes [INSERT: Count=195558, Max=21199, Min=118, Avg=406.44, 90=521, 99=955, 99.9=7071, 99.99=13639] 
2017-10-06 10:01:05:725 309 sec: 6566424 operations; 16477.2 current ops/sec; est completion in 2 minutes [INSERT: Count=164741, Max=239999, Min=86, Avg=482.97, 90=502, 99=2977, 99.9=29503, 99.99=135807] 
2017-10-06 10:01:15:729 319 sec: 6764894 operations; 19839.06 current ops/sec; est completion in 2 minutes [INSERT: Count=198468, Max=579071, Min=90, Avg=400.65, 90=486, 99=1039, 99.9=8863, 99.99=21583] 
2017-10-06 10:01:25:729 329 sec: 6954632 operations; 18975.7 current ops/sec; est completion in 2 minutes [INSERT: Count=189742, Max=15039, Min=119, Avg=418.96, 90=542, 99=982, 99.9=6435, 99.99=11199] 
2017-10-06 10:01:35:725 339 sec: 7144493 operations; 18991.8 current ops/sec; est completion in 2 minutes [INSERT: Count=189856, Max=23247, Min=112, Avg=418.5, 90=528, 99=1159, 99.9=7227, 99.99=15231] 
2017-10-06 10:01:45:724 349 sec: 7322966 operations; 17849.08 current ops/sec; est completion in 2 minutes [INSERT: Count=178474, Max=700927, Min=90, Avg=445.6, 90=512, 99=1214, 99.9=12543, 99.99=47551] 
2017-10-06 10:01:55:724 359 sec: 7518456 operations; 19550.96 current ops/sec; est completion in 1 minutes [INSERT: Count=195491, Max=22639, Min=108, Avg=406.56, 90=520, 99=954, 99.9=10431, 99.99=16431] 
2017-10-06 10:02:05:723 369 sec: 7704693 operations; 18623.7 current ops/sec; est completion in 1 minutes [INSERT: Count=186236, Max=119551, Min=120, Avg=426.86, 90=528, 99=1226, 99.9=10623, 99.99=27407] 
2017-10-06 10:02:15:726 379 sec: 7853681 operations; 14894.33 current ops/sec; est completion in 1 minutes [INSERT: Count=148987, Max=397823, Min=86, Avg=534.71, 90=500, 99=6031, 99.9=35807, 99.99=118911] 
2017-10-06 10:02:25:723 389 sec: 8065685 operations; 21208.88 current ops/sec; est completion in 1 minutes [INSERT: Count=212006, Max=17887, Min=103, Avg=374.63, 90=482, 99=822, 99.9=6575, 99.99=11839] 
2017-10-06 10:02:35:722 399 sec: 8255918 operations; 19023.3 current ops/sec; est completion in 1 minutes [INSERT: Count=190239, Max=19919, Min=126, Avg=417.87, 90=542, 99=1205, 99.9=7143, 99.99=15271] 
2017-10-06 10:02:45:722 409 sec: 8434858 operations; 17894 current ops/sec; est completion in 1 minutes [INSERT: Count=178936, Max=688127, Min=104, Avg=444.43, 90=548, 99=978, 99.9=6483, 99.99=15359] 
2017-10-06 10:02:55:722 419 sec: 8624852 operations; 18999.4 current ops/sec; est completion in 1 minutes [INSERT: Count=189991, Max=72127, Min=94, Avg=418.44, 90=518, 99=1177, 99.9=11791, 99.99=31439] 
2017-10-06 10:03:05:722 429 sec: 8803678 operations; 17884.39 current ops/sec; est completion in 59 seconds [INSERT: Count=178825, Max=17007, Min=117, Avg=444.64, 90=577, 99=993, 99.9=6015, 99.99=10927] 
2017-10-06 10:03:15:721 439 sec: 8951302 operations; 14762.4 current ops/sec; est completion in 52 seconds [INSERT: Count=147626, Max=668159, Min=111, Avg=539.21, 90=630, 99=1619, 99.9=11359, 99.99=100095] 
2017-10-06 10:03:25:721 449 sec: 9116423 operations; 16512.1 current ops/sec; est completion in 44 seconds [INSERT: Count=165121, Max=263167, Min=85, Avg=482.09, 90=505, 99=4775, 99.9=23775, 99.99=60575] 
2017-10-06 10:03:35:720 459 sec: 9313027 operations; 19662.37 current ops/sec; est completion in 34 seconds [INSERT: Count=196603, Max=16559, Min=108, Avg=404.26, 90=534, 99=845, 99.9=6583, 99.99=11575] 
2017-10-06 10:03:45:720 469 sec: 9473338 operations; 16031.1 current ops/sec; est completion in 27 seconds [INSERT: Count=160312, Max=857599, Min=110, Avg=496.35, 90=585, 99=1228, 99.9=8223, 99.99=17631] 
2017-10-06 10:03:55:720 479 sec: 9653123 operations; 17980.3 current ops/sec; est completion in 18 seconds [INSERT: Count=179783, Max=17999, Min=112, Avg=442.25, 90=581, 99=970, 99.9=6491, 99.99=12759] 
2017-10-06 10:04:05:724 489 sec: 9836128 operations; 18293.18 current ops/sec; est completion in 9 seconds [INSERT: Count=183006, Max=62399, Min=103, Avg=434.59, 90=550, 99=1219, 99.9=9823, 99.99=39039] 
2017-10-06 10:04:15:403 499 sec: 10000000 operations; 16928.93 current ops/sec; [CLEANUP: Count=8, Max=1917, Min=1, Avg=243.5, 90=22, 99=1917, 99.9=1917, 99.99=1917] [INSERT: Count=163867, Max=17919, Min=111, Avg=434.21, 90=568, 99=1106, 99.9=7075, 99.99=15407] 
[OVERALL], RunTime(ms), 499667.0
[OVERALL], Throughput(ops/sec), 20013.328877032105
[TOTAL_GCS_PS_Scavenge], Count, 2996.0
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 2238.0
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.4478983002679785
[TOTAL_GCS_PS_MarkSweep], Count, 1.0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 15.0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0030019993315548157
[TOTAL_GCs], Count, 2997.0
[TOTAL_GC_TIME], Time(ms), 2253.0
[TOTAL_GC_TIME_%], Time(%), 0.45090029959953326
[CLEANUP], Operations, 8.0
[CLEANUP], AverageLatency(us), 243.5
[CLEANUP], MinLatency(us), 1.0
[CLEANUP], MaxLatency(us), 1917.0
[CLEANUP], 95thPercentileLatency(us), 1917.0
[CLEANUP], 99thPercentileLatency(us), 1917.0
[INSERT], Operations, 1.0E7
[INSERT], AverageLatency(us), 396.5816837
[INSERT], MinLatency(us), 80.0
[INSERT], MaxLatency(us), 1069055.0
[INSERT], 95thPercentileLatency(us), 596.0
[INSERT], 99thPercentileLatency(us), 1147.0
[INSERT], Return=OK, 10000000
```

```
tjia@tfeng-mac:~/Projects/tjia/Logan/load-test/ycsb-0.12.0$ ./bin/ycsb run mongodb-async -s  -P workloads/workloada -p operationcount=10000000 -threads 8 -p mongodb.url="mongodb://localhost:27017/test"
java -cp /Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/conf:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/conf:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/core-0.12.0.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/HdrHistogram-2.1.4.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/htrace-core4-4.1.0-incubating.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/jackson-core-asl-1.9.4.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/lib/jackson-mapper-asl-1.9.4.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/logback-classic-1.1.2.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/logback-core-1.1.2.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/mongo-java-driver-3.0.3.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/mongodb-async-driver-2.0.1.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/mongodb-binding-0.12.0.jar:/Users/tjia/Projects/tjia/Logan/load-test/ycsb-0.12.0/mongodb-binding/lib/slf4j-api-1.6.4.jar com.yahoo.ycsb.Client -db com.yahoo.ycsb.db.AsyncMongoDbClient -s -P workloads/workloada -p operationcount=10000000 -threads 8 -p mongodb.url=mongodb://localhost:27017/test -t
YCSB Client 0.12.0
Command line: -db com.yahoo.ycsb.db.AsyncMongoDbClient -s -P workloads/workloada -p operationcount=10000000 -threads 8 -p mongodb.url=mongodb://localhost:27017/test -t
Loading workload...
Starting test.
2017-10-06 10:05:40:767 0 sec: 0 operations; est completion in 0 seconds 
mongo connection created with mongodb://localhost:27017/test
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
DBWrapper: report latency for each error is false and specific error codes to track for latency are: []
2017-10-06 10:05:50:770 10 sec: 250433 operations; 25035.79 current ops/sec; est completion in 6 minutes [READ: Count=125587, Max=37631, Min=69, Avg=279.52, 90=384, 99=637, 99.9=2369, 99.99=6535] [UPDATE: Count=124991, Max=44095, Min=108, Avg=350.69, 90=458, 99=770, 99.9=3499, 99.99=8295] 
2017-10-06 10:06:00:769 20 sec: 496182 operations; 24577.36 current ops/sec; est completion in 6 minutes [READ: Count=122753, Max=29199, Min=70, Avg=286.71, 90=396, 99=562, 99.9=2018, 99.99=5115] [UPDATE: Count=122890, Max=29119, Min=107, Avg=359.35, 90=467, 99=680, 99.9=2629, 99.99=12959] 
2017-10-06 10:06:10:769 30 sec: 744220 operations; 24803.8 current ops/sec; est completion in 6 minutes [READ: Count=123781, Max=7863, Min=71, Avg=284.63, 90=394, 99=564, 99.9=2067, 99.99=3989] [UPDATE: Count=124250, Max=7943, Min=113, Avg=355.52, 90=465, 99=669, 99.9=2555, 99.99=5643] 
2017-10-06 10:06:20:769 40 sec: 988172 operations; 24397.64 current ops/sec; est completion in 6 minutes [READ: Count=121975, Max=16847, Min=71, Avg=288.85, 90=398, 99=582, 99.9=2283, 99.99=6099] [UPDATE: Count=121975, Max=17023, Min=105, Avg=362.14, 90=469, 99=693, 99.9=3279, 99.99=7671] 
2017-10-06 10:06:30:768 50 sec: 1222625 operations; 23445.3 current ops/sec; est completion in 5 minutes [READ: Count=117334, Max=41087, Min=68, Avg=298.89, 90=406, 99=605, 99.9=3615, 99.99=22367] [UPDATE: Count=117122, Max=42911, Min=109, Avg=378.82, 90=481, 99=739, 99.9=6147, 99.99=31055] 
2017-10-06 10:06:40:768 60 sec: 1464893 operations; 24226.8 current ops/sec; est completion in 5 minutes [READ: Count=121034, Max=19919, Min=75, Avg=291.44, 90=403, 99=588, 99.9=1652, 99.99=6215] [UPDATE: Count=121223, Max=19967, Min=104, Avg=364.04, 90=475, 99=703, 99.9=2295, 99.99=7435] 
2017-10-06 10:06:50:768 70 sec: 1703831 operations; 23896.19 current ops/sec; est completion in 5 minutes [READ: Count=119340, Max=14151, Min=71, Avg=295.69, 90=407, 99=607, 99.9=1844, 99.99=6059] [UPDATE: Count=119604, Max=14103, Min=113, Avg=368.92, 90=481, 99=723, 99.9=3065, 99.99=6451] 
2017-10-06 10:07:00:767 80 sec: 1941364 operations; 23753.3 current ops/sec; est completion in 5 minutes [READ: Count=118738, Max=29647, Min=73, Avg=295.61, 90=407, 99=605, 99.9=1758, 99.99=7103] [UPDATE: Count=118787, Max=45983, Min=107, Avg=372.97, 90=483, 99=731, 99.9=2901, 99.99=18559] 
2017-10-06 10:07:10:767 90 sec: 2175096 operations; 23373.2 current ops/sec; est completion in 5 minutes [READ: Count=116929, Max=27567, Min=67, Avg=301.04, 90=409, 99=651, 99.9=5583, 99.99=9447] [UPDATE: Count=116808, Max=27727, Min=103, Avg=378.6, 90=484, 99=796, 99.9=6015, 99.99=9967] 
2017-10-06 10:07:20:767 100 sec: 2386733 operations; 21163.7 current ops/sec; est completion in 5 minutes [READ: Count=105477, Max=29343, Min=74, Avg=330.43, 90=438, 99=852, 99.9=6311, 99.99=13823] [UPDATE: Count=106165, Max=29423, Min=114, Avg=420.02, 90=520, 99=1224, 99.9=8051, 99.99=18239] 
2017-10-06 10:07:30:767 110 sec: 2595672 operations; 20893.9 current ops/sec; est completion in 5 minutes [READ: Count=104324, Max=70655, Min=69, Avg=331.15, 90=433, 99=845, 99.9=8359, 99.99=30207] [UPDATE: Count=104618, Max=70719, Min=105, Avg=429.34, 90=517, 99=1353, 99.9=11175, 99.99=42591] 
2017-10-06 10:07:40:766 119 sec: 2822107 operations; 22645.76 current ops/sec; est completion in 5 minutes [READ: Count=113478, Max=22703, Min=64, Avg=310.03, 90=419, 99=705, 99.9=5731, 99.99=13007] [UPDATE: Count=112955, Max=22687, Min=110, Avg=391.73, 90=497, 99=894, 99.9=6175, 99.99=13383] 
2017-10-06 10:07:50:766 129 sec: 3038991 operations; 21690.57 current ops/sec; est completion in 4 minutes [READ: Count=108353, Max=13887, Min=80, Avg=326.61, 90=450, 99=752, 99.9=3739, 99.99=8311] [UPDATE: Count=108521, Max=13519, Min=121, Avg=405.72, 90=533, 99=898, 99.9=5683, 99.99=8079] 
2017-10-06 10:08:00:765 139 sec: 3270134 operations; 23114.3 current ops/sec; est completion in 4 minutes [READ: Count=115244, Max=19359, Min=67, Avg=305.59, 90=419, 99=665, 99.9=2459, 99.99=6959] [UPDATE: Count=115900, Max=19359, Min=109, Avg=381.32, 90=496, 99=809, 99.9=4531, 99.99=11447] 
2017-10-06 10:08:10:765 149 sec: 3507511 operations; 23737.7 current ops/sec; est completion in 4 minutes [READ: Count=118107, Max=17199, Min=69, Avg=297.7, 90=411, 99=632, 99.9=2323, 99.99=5915] [UPDATE: Count=119260, Max=19327, Min=108, Avg=370.95, 90=486, 99=757, 99.9=3023, 99.99=6051] 
2017-10-06 10:08:20:765 159 sec: 3744591 operations; 23710.37 current ops/sec; est completion in 4 minutes [READ: Count=118480, Max=14463, Min=75, Avg=297.1, 90=410, 99=609, 99.9=1729, 99.99=5875] [UPDATE: Count=118611, Max=14623, Min=104, Avg=372.73, 90=484, 99=725, 99.9=3089, 99.99=7435] 
2017-10-06 10:08:30:764 169 sec: 3966183 operations; 22159.2 current ops/sec; est completion in 4 minutes [READ: Count=110924, Max=55551, Min=71, Avg=311.93, 90=409, 99=682, 99.9=8359, 99.99=37343] [UPDATE: Count=110673, Max=69823, Min=102, Avg=405.2, 90=488, 99=902, 99.9=11295, 99.99=45951] 
2017-10-06 10:08:40:764 179 sec: 4188598 operations; 22241.5 current ops/sec; est completion in 4 minutes [READ: Count=111161, Max=30703, Min=74, Avg=316.74, 90=429, 99=664, 99.9=5279, 99.99=14551] [UPDATE: Count=111239, Max=30783, Min=109, Avg=397.44, 90=506, 99=808, 99.9=6135, 99.99=21391] 
2017-10-06 10:08:50:764 189 sec: 4390492 operations; 20191.42 current ops/sec; est completion in 4 minutes [READ: Count=100725, Max=33343, Min=77, Avg=341.28, 90=435, 99=878, 99.9=9647, 99.99=23503] [UPDATE: Count=101178, Max=39135, Min=118, Avg=445.71, 90=517, 99=1951, 99.9=12023, 99.99=25519] 
2017-10-06 10:09:00:763 199 sec: 4560302 operations; 16981 current ops/sec; est completion in 3 minutes [READ: Count=84871, Max=31071, Min=93, Avg=412.55, 90=573, 99=1770, 99.9=7323, 99.99=17487] [UPDATE: Count=84939, Max=30895, Min=132, Avg=523.48, 90=697, 99=2797, 99.9=10047, 99.99=17999] 
2017-10-06 10:09:10:768 209 sec: 4791985 operations; 23165.98 current ops/sec; est completion in 3 minutes [READ: Count=115874, Max=30159, Min=66, Avg=303.71, 90=415, 99=618, 99.9=3851, 99.99=11119] [UPDATE: Count=115811, Max=30287, Min=107, Avg=382.25, 90=491, 99=750, 99.9=5999, 99.99=12343] 
2017-10-06 10:09:20:763 219 sec: 5032446 operations; 24050.91 current ops/sec; est completion in 3 minutes [READ: Count=119700, Max=21455, Min=72, Avg=293.26, 90=401, 99=601, 99.9=2937, 99.99=11383] [UPDATE: Count=120754, Max=22127, Min=101, Avg=366.68, 90=474, 99=739, 99.9=5435, 99.99=11871] 
2017-10-06 10:09:30:762 229 sec: 5256749 operations; 22430.3 current ops/sec; est completion in 3 minutes [READ: Count=112167, Max=119487, Min=67, Avg=311.04, 90=416, 99=643, 99.9=5671, 99.99=32079] [UPDATE: Count=112142, Max=123199, Min=105, Avg=397.22, 90=495, 99=817, 99.9=7991, 99.99=33855] 
2017-10-06 10:09:40:762 239 sec: 5503444 operations; 24669.5 current ops/sec; est completion in 3 minutes [READ: Count=123045, Max=13071, Min=64, Avg=285.48, 90=392, 99=583, 99.9=2187, 99.99=10919] [UPDATE: Count=123643, Max=13719, Min=103, Avg=358.09, 90=462, 99=718, 99.9=4707, 99.99=11935] 
2017-10-06 10:09:50:761 249 sec: 5754147 operations; 25072.81 current ops/sec; est completion in 3 minutes [READ: Count=125288, Max=13159, Min=69, Avg=281.73, 90=385, 99=573, 99.9=2053, 99.99=8063] [UPDATE: Count=125421, Max=13271, Min=103, Avg=351.69, 90=455, 99=687, 99.9=4583, 99.99=11023] 
2017-10-06 10:10:00:761 259 sec: 5992822 operations; 23867.5 current ops/sec; est completion in 2 minutes [READ: Count=120249, Max=247295, Min=69, Avg=294.85, 90=394, 99=604, 99.9=3079, 99.99=11727] [UPDATE: Count=118428, Max=247167, Min=102, Avg=371.22, 90=465, 99=727, 99.9=5591, 99.99=12247] 
2017-10-06 10:10:10:762 269 sec: 6237024 operations; 24417.76 current ops/sec; est completion in 2 minutes [READ: Count=122049, Max=18191, Min=68, Avg=288.7, 90=394, 99=603, 99.9=2527, 99.99=11023] [UPDATE: Count=122149, Max=18319, Min=104, Avg=361.7, 90=465, 99=736, 99.9=5479, 99.99=12039] 
2017-10-06 10:10:20:760 279 sec: 6479309 operations; 24233.35 current ops/sec; est completion in 2 minutes [READ: Count=120925, Max=29887, Min=70, Avg=290.78, 90=397, 99=588, 99.9=2221, 99.99=11743] [UPDATE: Count=121358, Max=29951, Min=108, Avg=364.48, 90=469, 99=710, 99.9=3745, 99.99=14319] 
2017-10-06 10:10:30:760 289 sec: 6716200 operations; 23689.1 current ops/sec; est completion in 2 minutes [READ: Count=118360, Max=67327, Min=66, Avg=294.84, 90=393, 99=598, 99.9=4343, 99.99=38879] [UPDATE: Count=118537, Max=67455, Min=106, Avg=375.75, 90=465, 99=749, 99.9=6971, 99.99=45951] 
2017-10-06 10:10:40:760 299 sec: 6964141 operations; 24794.1 current ops/sec; est completion in 2 minutes [READ: Count=124158, Max=16591, Min=61, Avg=284.08, 90=389, 99=569, 99.9=2167, 99.99=11311] [UPDATE: Count=123778, Max=17103, Min=105, Avg=356.54, 90=461, 99=699, 99.9=4023, 99.99=11663] 
2017-10-06 10:10:50:759 309 sec: 7211866 operations; 24774.98 current ops/sec; est completion in 2 minutes [READ: Count=124123, Max=19375, Min=68, Avg=284.53, 90=390, 99=583, 99.9=2389, 99.99=10815] [UPDATE: Count=123597, Max=21023, Min=105, Avg=356.7, 90=461, 99=698, 99.9=3911, 99.99=12351] 
2017-10-06 10:11:00:759 319 sec: 7452219 operations; 24035.3 current ops/sec; est completion in 1 minutes [READ: Count=120135, Max=29663, Min=68, Avg=292.95, 90=403, 99=597, 99.9=2171, 99.99=11767] [UPDATE: Count=120220, Max=29647, Min=107, Avg=367.76, 90=476, 99=749, 99.9=4123, 99.99=11879] 
2017-10-06 10:11:10:759 329 sec: 7700052 operations; 24783.3 current ops/sec; est completion in 1 minutes [READ: Count=123805, Max=12407, Min=70, Avg=285.04, 90=393, 99=582, 99.9=1551, 99.99=7979] [UPDATE: Count=124027, Max=12495, Min=105, Avg=355.68, 90=465, 99=702, 99.9=2723, 99.99=7379] 
2017-10-06 10:11:20:758 339 sec: 7946882 operations; 24685.47 current ops/sec; est completion in 1 minutes [READ: Count=123072, Max=13919, Min=67, Avg=285.36, 90=394, 99=585, 99.9=1874, 99.99=6779] [UPDATE: Count=123754, Max=13911, Min=102, Avg=357.88, 90=466, 99=710, 99.9=2901, 99.99=10831] 
2017-10-06 10:11:30:758 349 sec: 8181299 operations; 23441.7 current ops/sec; est completion in 1 minutes [READ: Count=117198, Max=47135, Min=69, Avg=299.03, 90=407, 99=639, 99.9=4555, 99.99=20111] [UPDATE: Count=117230, Max=47199, Min=106, Avg=378.61, 90=483, 99=814, 99.9=6283, 99.99=23007] 
2017-10-06 10:11:40:758 359 sec: 8417926 operations; 23662.7 current ops/sec; est completion in 1 minutes [READ: Count=118545, Max=31039, Min=73, Avg=298.43, 90=413, 99=617, 99.9=1548, 99.99=5739] [UPDATE: Count=118074, Max=31151, Min=110, Avg=372.87, 90=488, 99=731, 99.9=2055, 99.99=6283] 
2017-10-06 10:11:50:757 369 sec: 8660540 operations; 24263.83 current ops/sec; est completion in 58 seconds [READ: Count=120985, Max=12975, Min=77, Avg=291.21, 90=402, 99=595, 99.9=1667, 99.99=5999] [UPDATE: Count=121631, Max=12903, Min=110, Avg=363.15, 90=475, 99=722, 99.9=2475, 99.99=6907] 
2017-10-06 10:12:00:757 379 sec: 8903860 operations; 24332 current ops/sec; est completion in 47 seconds [READ: Count=121991, Max=14607, Min=65, Avg=289.8, 90=400, 99=604, 99.9=1717, 99.99=6391] [UPDATE: Count=121329, Max=14871, Min=111, Avg=363.12, 90=474, 99=729, 99.9=2887, 99.99=9767] 
2017-10-06 10:12:10:757 389 sec: 9148625 operations; 24476.5 current ops/sec; est completion in 37 seconds [READ: Count=122110, Max=12119, Min=70, Avg=288.01, 90=400, 99=593, 99.9=1586, 99.99=5731] [UPDATE: Count=122651, Max=12351, Min=107, Avg=360.71, 90=471, 99=715, 99.9=3025, 99.99=7407] 
2017-10-06 10:12:20:757 399 sec: 9383755 operations; 23515.35 current ops/sec; est completion in 27 seconds [READ: Count=117944, Max=20255, Min=70, Avg=298.14, 90=403, 99=660, 99.9=5671, 99.99=11535] [UPDATE: Count=117187, Max=20223, Min=109, Avg=377.51, 90=477, 99=826, 99.9=6035, 99.99=12639] 
2017-10-06 10:12:30:756 409 sec: 9610119 operations; 22636.4 current ops/sec; est completion in 17 seconds [READ: Count=112839, Max=37151, Min=65, Avg=308.34, 90=406, 99=687, 99.9=6671, 99.99=31311] [UPDATE: Count=113523, Max=37151, Min=108, Avg=393.38, 90=481, 99=1222, 99.9=8263, 99.99=23471] 
2017-10-06 10:12:40:756 419 sec: 9854349 operations; 24425.44 current ops/sec; est completion in 7 seconds [READ: Count=122304, Max=17423, Min=69, Avg=288.81, 90=396, 99=591, 99.9=2369, 99.99=8231] [UPDATE: Count=121933, Max=18303, Min=110, Avg=361.65, 90=468, 99=716, 99.9=4331, 99.99=11951] 
2017-10-06 10:12:46:954 426 sec: 10000000 operations; 23495.89 current ops/sec; [READ: Count=72982, Max=14135, Min=68, Avg=291.9, 90=402, 99=600, 99.9=3575, 99.99=11175] [CLEANUP: Count=8, Max=1710, Min=3, Avg=216.88, 90=7, 99=1710, 99.9=1710, 99.99=1710] [UPDATE: Count=72651, Max=15135, Min=116, Avg=367.68, 90=474, 99=737, 99.9=5827, 99.99=11375] 
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

