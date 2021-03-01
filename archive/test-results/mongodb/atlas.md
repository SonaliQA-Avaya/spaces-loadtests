# MongoDB Atlas

## Using benchRun on M0 free instance

M0 free instance uses shared RAM, 512M storage, on AWS us-east-1.

```
[tjia@tfeng-mac:~/Projects/tjia/mongo-perf$ python benchrun.py -f testcases/simple_query.js -t 1 2 4 8 --database test --host cluster0-shard-00-00-wjwxv.mongodb.net:27017,cluster0-shard-00-01-wjwxv.mongodb.net:27017,cluster0-shard-00-02-wjwxv.mongodb.net:27017 --replset Cluster0-shard-0 --username jack --password *********** --ssl --authdb admin
Percona Server for MongoDB shell version v3.4.4-1.4
connecting to: mongodb://cluster0-shard-00-00-wjwxv.mongodb.net:27017,cluster0-shard-00-01-wjwxv.mongodb.net:27017,cluster0-shard-00-02-wjwxv.mongodb.net:27017/test?replicaSet=Cluster0-shard-0
2017-10-04T10:51:22.805-0400 I NETWORK  [thread1] Starting new replica set monitor for Cluster0-shard-0/cluster0-shard-00-00-wjwxv.mongodb.net:27017,cluster0-shard-00-01-wjwxv.mongodb.net:27017,cluster0-shard-00-02-wjwxv.mongodb.net:27017
Percona Server for MongoDB server version: v3.4.9
db version: 3.4.9
876ebee8c7dd0e2d992f36a848ff4dc50ee6603e

load('util/utils.js')

load('testcases/simple_query.js')

mongoPerfRunTests([1, 2, 4, 8], "test", 1, 5, 1, "%", [], 0, {"writeCmdMode": "true", "safeGLE": "false", "readCmdMode": "false", "writeConcern": {"j": "false"}}, false, false, 'jack', '***********');

Queries.Empty
1 22.922821823079687
2 44.93274439107719
4 87.59659793753416
8 86.42239024764092
Queries.IdentityView.Empty
1 22.797584804041875
2 47.26090560165792
4 87.66531279042837
8 85.91965105976756
Aggregation.Empty
1 23.875479704757
2 47.521035483363185
4 86.01568807508161
8 84.80260966865968
Queries.NoMatch
1 23.951474708133468
2 44.94693895574856
4 83.94522917833939
8 84.2271959968706
Queries.IdentityView.NoMatch
1 23.915950258776512
2 45.817388154995264
4 87.5745662992602
8 88.88895896641259
Aggregation.NoMatch
1 23.65424122516354
2 41.50256513259874
4 86.99022538989058
8 82.58732983006112
Queries.IntIdFindOne
1 24.53796484475222
2 46.989792598065634
4 87.73260527813613
8 84.2422507954791
Queries.IdentityView.IntIdFindOne
1 0
2 0
4 0
8 0
Aggregation.IntIdFindOne
^CTraceback (most recent call last):
  File "benchrun.py", line 286, in <module>
    main()
  File "benchrun.py", line 255, in main
    for line in iter(mongo_proc.stdout.readline, ''):
```
