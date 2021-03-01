# MongoDB on GCP

- Server: n1-standard-8 (8 vCPUs, 30 GB memory) in us-central1-a, Debian 8 Jessie with MongoDB CE v3.4.9.
- Testing Client: n1-standard-8 (8 vCPUs, 30 GB memory) in us-central1-a
- Test Tools:
  + [mongo-perf](https://github.com/mongodb/mongo-perf), is a micro benchmarking tool for the MongoDB server. It measures throughput of commands with regards to the number of threads. This tool is based on (mongo benchRun command](https://github.com/mongodb/mongo/wiki/JavaScript-Benchmarking-Harness), which is designed as a QA baseline performance measurement tool; it is not designed to be a "benchmark".
  + [mongoperf](https://docs.mongodb.com/manual/reference/program/mongoperf/) is a utility to check disk I/O performance independently of MongoDB.

## IO Performance

```
jackj@tjiatest-8cpu:~$ echo "{nThreads:8,fileSizeMB:2000,r:true,w:true}" | mongoperf
mongoperf
use -h for help
parsed options:
{ nThreads: 8, fileSizeMB: 2000, r: true, w: true }
creating test file size:2000MB ...
1GB...
testing...
options:{ nThreads: 8, fileSizeMB: 2000, r: true, w: true }
wthr 8
new thread, total running : 1
read:1 write:1
164 ops/sec 0 MB/sec
162 ops/sec 0 MB/sec
140 ops/sec 0 MB/sec
126 ops/sec 0 MB/sec
118 ops/sec 0 MB/sec
114 ops/sec 0 MB/sec
122 ops/sec 0 MB/sec
122 ops/sec 0 MB/sec
new thread, total running : 2
read:1 write:1
243 ops/sec 0 MB/sec
237 ops/sec 0 MB/sec
216 ops/sec 0 MB/sec
230 ops/sec 0 MB/sec
248 ops/sec 0 MB/sec
247 ops/sec 0 MB/sec
249 ops/sec 0 MB/sec
258 ops/sec 1 MB/sec
new thread, total running : 4
read:1 write:1
read:1 write:1
454 ops/sec 1 MB/sec
478 ops/sec 1 MB/sec
476 ops/sec 1 MB/sec
508 ops/sec 1 MB/sec
480 ops/sec 1 MB/sec
487 ops/sec 1 MB/sec
506 ops/sec 1 MB/sec
498 ops/sec 1 MB/sec
read:1 write:1
read:1 write:1
read:1 write:1
new thread, total running : read:1 write:1
8
1028 ops/sec 4 MB/sec
258 ops/sec 1 MB/sec
989 ops/sec 3 MB/sec
1006 ops/sec 3 MB/sec
1051 ops/sec 4 MB/sec
1052 ops/sec 4 MB/sec
1021 ops/sec 3 MB/sec
1034 ops/sec 4 MB/sec
1024 ops/sec 4 MB/sec
1005 ops/sec 3 MB/sec
1033 ops/sec 4 MB/sec
1004 ops/sec 3 MB/sec
991 ops/sec 3 MB/sec
^C
```

Maximum disk write 67.88M/s.

## Query Performance

```
ackj@tjiatest-8cpu3:~/mongo-perf$ python benchrun.py --host 10.240.0.18 -f testcases/simple_query.js -t 1 2 4 8
MongoDB shell version v3.4.9
connecting to: mongodb://10.240.0.18:27017/
MongoDB server version: 3.4.9
db version: 3.4.9
876ebee8c7dd0e2d992f36a848ff4dc50ee6603e

load('util/utils.js')

load('testcases/simple_query.js')

mongoPerfRunTests([1, 2, 4, 8], 1, 1, 5, 1, "%", [], 0, {"writeCmdMode": "true", "safeGLE": "false", "readCmdMode": "false", "writeConcern": {"j": "false"}}, false, false);

Queries.Empty
1       6810.052393783593
2       12448.860934720879
4       23214.311054739348
8       35831.730464732995
Queries.IdentityView.Empty
1       8640.231952106304
2       13831.641566686523
4       26833.000352802785
8       46109.71336265508
Aggregation.Empty
1       5537.908576431853
2       8679.843445791706
4       15450.856842045516
8       26012.64695991613
Queries.NoMatch
1       8121.311731674275
2       12039.971064892316
4       22956.82645534647
8       39402.694357419074
Queries.IdentityView.NoMatch
1       9217.553452214652
2       14341.942190061167
4       25025.728888569978
8       43376.28279907267
Aggregation.NoMatch
1       6751.563146896526
2       10509.06527070873
4       19639.932243702813
8       34033.353761724764
Queries.IntIdFindOne
1       9280.030064546821
2       15212.62777635854
4       28265.127079861068
8       45302.61457538403
Queries.IdentityView.IntIdFindOne
1       0
2       0
4       0
8       0
Aggregation.IntIdFindOne
1       6214.105187242695
2       11546.906095875875
4       21648.68921492798
8       38158.551024408276
Queries.IntNonIdFindOne
1       9807.939103422634
2       15887.31029719307
4       28933.61519393039
8       47065.253011277804
Queries.IdentityView.IntNonIdFindOne
1       0
2       0
4       0
8       0
Aggregation.IntNonIdFindOne
1       6524.796666058983
2       11765.538380473912
4       23613.39506059339
8       41563.02404135901
Queries.IntIDRange
1       6576.146037780054
2       9812.084145842933
4       17979.513316344375
8       30911.84023656933
Queries.IdentityView.IntIDRange
1       8253.246966126646
2       12749.759925031045
4       25629.578084309596
8       43433.49145459773
Aggregation.IntIDRange
1       4813.4094343944125
2       7839.313268481486
4       13828.323088724563
8       23430.3720828929
Queries.IntNonIDRange
1       8665.731591991618
2       12967.511057466843
4       25202.86495404233
8       41505.058171065415
Queries.IdentityView.IntNonIDRange
1       9029.122021774954
2       13674.8258388222
4       26352.06089525653
8       43422.258146057036
Aggregation.IntNonIDRange
1       7337.439671706143
2       11609.902479217913
4       20550.835135012512
8       36744.823077003006
Queries.RegexPrefixFindOne
1       9948.804676146097
2       14929.991738099554
4       28967.923772913768
8       46105.39386269852
Queries.IdentityView.RegexPrefixFindOne
1       9089.306211745572
2       14137.235081754938
4       26224.76122559966
8       45086.41487932604
Aggregation.RegexPrefixFindOne
1       8020.091509685922
2       12814.215957609918
4       24409.1151668269
8       42694.786834786624
Queries.TwoInts
1       8358.144628226384
2       13536.06412074453
4       24111.74336349875
8       42208.60577658967
Queries.IdentityView.TwoInts
1       9075.483360747565
2       14035.467893242485
4       27175.68811722269
8       44519.971719902336
Aggregation.TwoInts
1       6708.269921254742
2       10361.351949330287
4       18416.25190062243
8       32723.4204893385
Queries.StringRangeWithNonSimpleCollation
1       7396.466263830019
2       12138.18077004339
4       22053.301858979034
8       38989.01055867872
Queries.IdentityView.StringRangeWithNonSimpleCollation
1       8747.263106951574
2       13366.332873162864
4       23575.35117475162
8       41470.16093372451
Aggregation.StringRangeWithNonSimpleCollation
1       5692.91027874251
2       10303.936852680708
4       17418.053264878166
8       30412.247540341596
Queries.StringRangeWithSimpleCollation
1       7802.211772720403
2       13124.46139333384
4       22909.409911500814
8       40157.937247940055
Queries.IdentityView.StringRangeWithSimpleCollation
1       8929.09440239378
2       14656.681122584116
4       23723.822218438007
8       41956.96178755053
Aggregation.StringRangeWithSimpleCollation
1       6572.333751179628
2       11157.946541244464
4       17842.423505915896
8       33142.31275891027
Queries.StringUnindexedInPredWithNonSimpleCollation
1       5776.053503149066
2       8940.086012873948
4       18801.614445178882
8       30591.847782536657
Aggregation.StringUnindexedInPredWithNonSimpleCollation
1       5256.643910995837
2       8962.639312283987
4       16398.48479943018
8       27149.922565819055
Queries.StringUnindexedInPredWithSimpleCollation
1       6552.062379423922
2       10943.535442034176
4       20224.47300522563
8       35539.090801917424
Aggregation.StringUnindexedInPredWithSimpleCollation
1       5915.355957824104
2       9631.763492004478
4       18547.393664747757
8       31509.106811679725
Queries.IntNonIdFindOneProjectionCovered
1       7803.498941810364
2       12726.019979527551
4       23441.04320287701
8       39484.24306947629
Queries.IdentityView.IntNonIdFindOneProjectionCovered
1       8451.575359813658
2       12197.818013184671
4       21465.900151576203
8       34345.845696944
Aggregation.IntNonIdFindOneProjectionCovered
1       6292.717826808429
2       10690.279539645726
4       19756.16244564282
8       33803.43721499419
Queries.IntNonIdFindOneProjection
1       7739.82977971469
2       14877.853952475305
4       24789.554238568428
8       45375.091216154105
Queries.IdentityView.IntNonIdFindOneProjection
1       8547.594597171767
2       13454.158149078223
4       22528.9634402275
8       36536.02880042137
Aggregation.IntNonIdFindOneProjection
1       6401.0704497540055
2       11201.785249543555
4       20565.777732032522
8       35569.7167527429
Queries.IntNonIdFindProjectionCovered
1       6157.698982792265
2       9062.072045221808
4       16569.01280429103
8       27863.77337792027
Queries.IdentityView.IntNonIdFindProjectionCovered
1       8597.325409806244
2       13933.93801542219
4       25450.718751499066
8       43240.95543115761
Aggregation.IntNonIdFindProjectionCovered
1       3709.343102842717
2       6229.05767664503
4       10984.558816768917
8       17423.87692049517
Queries.FindProjection
1       6191.192367720806
2       9888.807136779275
4       18905.047442001396
8       31087.137695529676
Queries.IdentityView.FindProjection
1       8568.810035190329
2       13990.719095216726
4       25082.01118158057
8       42816.235534846324
Aggregation.FindProjection
1       3995.1635074685187
2       6639.350701766555
4       12151.927371024793
8       20110.891871033546
Queries.FindWideDocProjection
1       4512.135810250416
2       6685.222625529583
4       13698.63287444079
8       23162.101140881936
Queries.IdentityView.FindWideDocProjection
1       8033.662970233163
2       12962.521379505535
4       24363.999016694215
8       42449.934535618544
Aggregation.FindWideDocProjection
1       3357.727180318765
2       5797.229499604403
4       10647.728310732737
8       17159.922249442112
Queries.FindProjectionThreeFieldsCovered
1       8047.192607136497
2       13188.587081013207
4       25142.496667948584
8       41603.155635663155
Queries.IdentityView.FindProjectionThreeFieldsCovered
1       8905.012137746633
2       13161.313481137535
4       24647.902807543123
8       41257.77999540798
Aggregation.FindProjectionThreeFieldsCovered
1       6237.886906814517
2       10599.530046859396
4       17673.114536668352
8       31922.858437063725
Queries.FindProjectionThreeFields
1       6018.651041774943
2       10128.35243068465
4       18461.93266967993
8       30778.43423607283
Queries.IdentityView.FindProjectionThreeFields
1       8592.093642666296
2       14198.256661654592
4       27048.716832971117
8       43656.27851871627
Aggregation.FindProjectionThreeFields
1       3660.1569004181865
2       6120.540574137683
4       11467.592399202369
8       18273.587290232794
Queries.FindProjectionDottedField
1       5879.120516673366
2       8907.1023941973
4       16525.212251578658
8       28411.169613229973
Queries.IdentityView.FindProjectionDottedField
1       8955.968586743278
2       14284.192366986515
4       25351.50068964029
8       44307.653450767735
Aggregation.FindProjectionDottedField
1       3177.5040311021567
2       5580.30404731455
4       10113.252437973384
8       17406.2948173575
Queries.FindProjectionDottedField.Indexed
1       8439.988445765564
2       14065.19073181409
4       27968.648250625312
8       46766.62943373304
Queries.IdentityView.FindProjectionDottedField.Indexed
1       9237.0622755554
2       13642.462531954687
4       25255.46873376089
8       42179.44798454213
Aggregation.FindProjectionDottedField.Indexed
1       6209.788297492537
2       10414.296994472708
4       19828.690888252517
8       35085.9592411805
Queries.LargeDocs
1       1.8206867521187786
2       2.352679294521967
4       2.319763105791637
8       2.5198441431929597
Queries.IdentityView.LargeDocs
1       7650.820670248349
2       13541.05451681638
4       23699.22682848976
8       44404.024330129185
Aggregation.LargeDocs
1       1.3797148799490373
2       2.0506836723028
4       2.384774509349679
8       2.395316796365586
Finished Testing.
{
    "start": "2017-09-27T18:30:22.237Z",
    "basicFields": {
        "crudOptions": {
            "writeCmdMode": "true",
            "safeGLE": "false",
            "readCmdMode": "false",
            "writeConcern": {
                "j": false
            }
        },
        "commit": "876ebee8c7dd0e2d992f36a848ff4dc50ee6603e",
        "version": "3.4.9",
        "platform": "deprecated"
    },
    "errors": [
        0
    ],
    "end": "2017-09-27T18:53:03.699Z",
    "results": [
        {
            "name": "Queries.Empty",
            "results": {
                "end": "2017-09-27T18:30:42.492Z",
                "1": {
                    "ops_per_sec": 6810.052393783593,
                    "ops_per_sec_values": [
                        6810.052393783593
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:30:22.237Z",
                "2": {
                    "ops_per_sec": 12448.860934720879,
                    "ops_per_sec_values": [
                        12448.860934720879
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 23214.311054739348,
                    "ops_per_sec_values": [
                        23214.311054739348
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 35831.730464732995,
                    "ops_per_sec_values": [
                        35831.730464732995
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.Empty",
            "results": {
                "end": "2017-09-27T18:31:02.714Z",
                "1": {
                    "ops_per_sec": 8640.231952106304,
                    "ops_per_sec_values": [
                        8640.231952106304
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:30:42.492Z",
                "2": {
                    "ops_per_sec": 13831.641566686523,
                    "ops_per_sec_values": [
                        13831.641566686523
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 26833.000352802785,
                    "ops_per_sec_values": [
                        26833.000352802785
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 46109.71336265508,
                    "ops_per_sec_values": [
                        46109.71336265508
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.Empty",
            "results": {
                "end": "2017-09-27T18:31:22.973Z",
                "1": {
                    "ops_per_sec": 5537.908576431853,
                    "ops_per_sec_values": [
                        5537.908576431853
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:31:02.714Z",
                "2": {
                    "ops_per_sec": 8679.843445791706,
                    "ops_per_sec_values": [
                        8679.843445791706
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 15450.856842045516,
                    "ops_per_sec_values": [
                        15450.856842045516
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 26012.64695991613,
                    "ops_per_sec_values": [
                        26012.64695991613
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.NoMatch",
            "results": {
                "end": "2017-09-27T18:31:43.208Z",
                "1": {
                    "ops_per_sec": 8121.311731674275,
                    "ops_per_sec_values": [
                        8121.311731674275
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:31:22.973Z",
                "2": {
                    "ops_per_sec": 12039.971064892316,
                    "ops_per_sec_values": [
                        12039.971064892316
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 22956.82645534647,
                    "ops_per_sec_values": [
                        22956.82645534647
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 39402.694357419074,
                    "ops_per_sec_values": [
                        39402.694357419074
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.NoMatch",
            "results": {
                "end": "2017-09-27T18:32:03.490Z",
                "1": {
                    "ops_per_sec": 9217.553452214652,
                    "ops_per_sec_values": [
                        9217.553452214652
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:31:43.208Z",
                "2": {
                    "ops_per_sec": 14341.942190061167,
                    "ops_per_sec_values": [
                        14341.942190061167
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 25025.728888569978,
                    "ops_per_sec_values": [
                        25025.728888569978
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 43376.28279907267,
                    "ops_per_sec_values": [
                        43376.28279907267
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.NoMatch",
            "results": {
                "end": "2017-09-27T18:32:23.661Z",
                "1": {
                    "ops_per_sec": 6751.563146896526,
                    "ops_per_sec_values": [
                        6751.563146896526
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:32:03.490Z",
                "2": {
                    "ops_per_sec": 10509.06527070873,
                    "ops_per_sec_values": [
                        10509.06527070873
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 19639.932243702813,
                    "ops_per_sec_values": [
                        19639.932243702813
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 34033.353761724764,
                    "ops_per_sec_values": [
                        34033.353761724764
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IntIdFindOne",
            "results": {
                "end": "2017-09-27T18:32:44.088Z",
                "1": {
                    "ops_per_sec": 9280.030064546821,
                    "ops_per_sec_values": [
                        9280.030064546821
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:32:23.661Z",
                "2": {
                    "ops_per_sec": 15212.62777635854,
                    "ops_per_sec_values": [
                        15212.62777635854
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 28265.127079861068,
                    "ops_per_sec_values": [
                        28265.127079861068
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 45302.61457538403,
                    "ops_per_sec_values": [
                        45302.61457538403
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.IntIdFindOne",
            "results": {
                "end": "2017-09-27T18:33:04.567Z",
                "1": {
                    "ops_per_sec": 0,
                    "ops_per_sec_values": [
                        0
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:32:44.088Z",
                "2": {
                    "ops_per_sec": 0,
                    "ops_per_sec_values": [
                        0
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 0,
                    "ops_per_sec_values": [
                        0
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 0,
                    "ops_per_sec_values": [
                        0
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.IntIdFindOne",
            "results": {
                "end": "2017-09-27T18:33:24.965Z",
                "1": {
                    "ops_per_sec": 6214.105187242695,
                    "ops_per_sec_values": [
                        6214.105187242695
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:33:04.567Z",
                "2": {
                    "ops_per_sec": 11546.906095875875,
                    "ops_per_sec_values": [
                        11546.906095875875
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 21648.68921492798,
                    "ops_per_sec_values": [
                        21648.68921492798
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 38158.551024408276,
                    "ops_per_sec_values": [
                        38158.551024408276
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IntNonIdFindOne",
            "results": {
                "end": "2017-09-27T18:33:45.548Z",
                "1": {
                    "ops_per_sec": 9807.939103422634,
                    "ops_per_sec_values": [
                        9807.939103422634
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:33:24.965Z",
                "2": {
                    "ops_per_sec": 15887.31029719307,
                    "ops_per_sec_values": [
                        15887.31029719307
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 28933.61519393039,
                    "ops_per_sec_values": [
                        28933.61519393039
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 47065.253011277804,
                    "ops_per_sec_values": [
                        47065.253011277804
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.IntNonIdFindOne",
            "results": {
                "end": "2017-09-27T18:34:06.029Z",
                "1": {
                    "ops_per_sec": 0,
                    "ops_per_sec_values": [
                        0
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:33:45.549Z",
                "2": {
                    "ops_per_sec": 0,
                    "ops_per_sec_values": [
                        0
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 0,
                    "ops_per_sec_values": [
                        0
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 0,
                    "ops_per_sec_values": [
                        0
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.IntNonIdFindOne",
            "results": {
                "end": "2017-09-27T18:34:26.491Z",
                "1": {
                    "ops_per_sec": 6524.796666058983,
                    "ops_per_sec_values": [
                        6524.796666058983
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:34:06.029Z",
                "2": {
                    "ops_per_sec": 11765.538380473912,
                    "ops_per_sec_values": [
                        11765.538380473912
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 23613.39506059339,
                    "ops_per_sec_values": [
                        23613.39506059339
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 41563.02404135901,
                    "ops_per_sec_values": [
                        41563.02404135901
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IntIDRange",
            "results": {
                "end": "2017-09-27T18:34:46.902Z",
                "1": {
                    "ops_per_sec": 6576.146037780054,
                    "ops_per_sec_values": [
                        6576.146037780054
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:34:26.491Z",
                "2": {
                    "ops_per_sec": 9812.084145842933,
                    "ops_per_sec_values": [
                        9812.084145842933
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 17979.513316344375,
                    "ops_per_sec_values": [
                        17979.513316344375
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 30911.84023656933,
                    "ops_per_sec_values": [
                        30911.84023656933
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.IntIDRange",
            "results": {
                "end": "2017-09-27T18:35:07.350Z",
                "1": {
                    "ops_per_sec": 8253.246966126646,
                    "ops_per_sec_values": [
                        8253.246966126646
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:34:46.902Z",
                "2": {
                    "ops_per_sec": 12749.759925031045,
                    "ops_per_sec_values": [
                        12749.759925031045
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 25629.578084309596,
                    "ops_per_sec_values": [
                        25629.578084309596
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 43433.49145459773,
                    "ops_per_sec_values": [
                        43433.49145459773
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.IntIDRange",
            "results": {
                "end": "2017-09-27T18:35:28.079Z",
                "1": {
                    "ops_per_sec": 4813.4094343944125,
                    "ops_per_sec_values": [
                        4813.4094343944125
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:35:07.350Z",
                "2": {
                    "ops_per_sec": 7839.313268481486,
                    "ops_per_sec_values": [
                        7839.313268481486
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 13828.323088724563,
                    "ops_per_sec_values": [
                        13828.323088724563
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 23430.3720828929,
                    "ops_per_sec_values": [
                        23430.3720828929
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IntNonIDRange",
            "results": {
                "end": "2017-09-27T18:35:48.628Z",
                "1": {
                    "ops_per_sec": 8665.731591991618,
                    "ops_per_sec_values": [
                        8665.731591991618
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:35:28.079Z",
                "2": {
                    "ops_per_sec": 12967.511057466843,
                    "ops_per_sec_values": [
                        12967.511057466843
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 25202.86495404233,
                    "ops_per_sec_values": [
                        25202.86495404233
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 41505.058171065415,
                    "ops_per_sec_values": [
                        41505.058171065415
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.IntNonIDRange",
            "results": {
                "end": "2017-09-27T18:36:09.162Z",
                "1": {
                    "ops_per_sec": 9029.122021774954,
                    "ops_per_sec_values": [
                        9029.122021774954
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:35:48.628Z",
                "2": {
                    "ops_per_sec": 13674.8258388222,
                    "ops_per_sec_values": [
                        13674.8258388222
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 26352.06089525653,
                    "ops_per_sec_values": [
                        26352.06089525653
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 43422.258146057036,
                    "ops_per_sec_values": [
                        43422.258146057036
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.IntNonIDRange",
            "results": {
                "end": "2017-09-27T18:36:29.635Z",
                "1": {
                    "ops_per_sec": 7337.439671706143,
                    "ops_per_sec_values": [
                        7337.439671706143
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:36:09.162Z",
                "2": {
                    "ops_per_sec": 11609.902479217913,
                    "ops_per_sec_values": [
                        11609.902479217913
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 20550.835135012512,
                    "ops_per_sec_values": [
                        20550.835135012512
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 36744.823077003006,
                    "ops_per_sec_values": [
                        36744.823077003006
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.RegexPrefixFindOne",
            "results": {
                "end": "2017-09-27T18:36:50.135Z",
                "1": {
                    "ops_per_sec": 9948.804676146097,
                    "ops_per_sec_values": [
                        9948.804676146097
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:36:29.635Z",
                "2": {
                    "ops_per_sec": 14929.991738099554,
                    "ops_per_sec_values": [
                        14929.991738099554
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 28967.923772913768,
                    "ops_per_sec_values": [
                        28967.923772913768
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 46105.39386269852,
                    "ops_per_sec_values": [
                        46105.39386269852
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.RegexPrefixFindOne",
            "results": {
                "end": "2017-09-27T18:37:10.682Z",
                "1": {
                    "ops_per_sec": 9089.306211745572,
                    "ops_per_sec_values": [
                        9089.306211745572
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:36:50.135Z",
                "2": {
                    "ops_per_sec": 14137.235081754938,
                    "ops_per_sec_values": [
                        14137.235081754938
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 26224.76122559966,
                    "ops_per_sec_values": [
                        26224.76122559966
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 45086.41487932604,
                    "ops_per_sec_values": [
                        45086.41487932604
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.RegexPrefixFindOne",
            "results": {
                "end": "2017-09-27T18:37:31.229Z",
                "1": {
                    "ops_per_sec": 8020.091509685922,
                    "ops_per_sec_values": [
                        8020.091509685922
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:37:10.682Z",
                "2": {
                    "ops_per_sec": 12814.215957609918,
                    "ops_per_sec_values": [
                        12814.215957609918
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 24409.1151668269,
                    "ops_per_sec_values": [
                        24409.1151668269
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 42694.786834786624,
                    "ops_per_sec_values": [
                        42694.786834786624
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.TwoInts",
            "results": {
                "end": "2017-09-27T18:37:51.933Z",
                "1": {
                    "ops_per_sec": 8358.144628226384,
                    "ops_per_sec_values": [
                        8358.144628226384
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:37:31.230Z",
                "2": {
                    "ops_per_sec": 13536.06412074453,
                    "ops_per_sec_values": [
                        13536.06412074453
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 24111.74336349875,
                    "ops_per_sec_values": [
                        24111.74336349875
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 42208.60577658967,
                    "ops_per_sec_values": [
                        42208.60577658967
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.TwoInts",
            "results": {
                "end": "2017-09-27T18:38:12.607Z",
                "1": {
                    "ops_per_sec": 9075.483360747565,
                    "ops_per_sec_values": [
                        9075.483360747565
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:37:51.933Z",
                "2": {
                    "ops_per_sec": 14035.467893242485,
                    "ops_per_sec_values": [
                        14035.467893242485
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 27175.68811722269,
                    "ops_per_sec_values": [
                        27175.68811722269
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 44519.971719902336,
                    "ops_per_sec_values": [
                        44519.971719902336
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.TwoInts",
            "results": {
                "end": "2017-09-27T18:38:33.190Z",
                "1": {
                    "ops_per_sec": 6708.269921254742,
                    "ops_per_sec_values": [
                        6708.269921254742
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:38:12.607Z",
                "2": {
                    "ops_per_sec": 10361.351949330287,
                    "ops_per_sec_values": [
                        10361.351949330287
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 18416.25190062243,
                    "ops_per_sec_values": [
                        18416.25190062243
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 32723.4204893385,
                    "ops_per_sec_values": [
                        32723.4204893385
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.StringRangeWithNonSimpleCollation",
            "results": {
                "end": "2017-09-27T18:38:53.994Z",
                "1": {
                    "ops_per_sec": 7396.466263830019,
                    "ops_per_sec_values": [
                        7396.466263830019
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:38:33.190Z",
                "2": {
                    "ops_per_sec": 12138.18077004339,
                    "ops_per_sec_values": [
                        12138.18077004339
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 22053.301858979034,
                    "ops_per_sec_values": [
                        22053.301858979034
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 38989.01055867872,
                    "ops_per_sec_values": [
                        38989.01055867872
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.StringRangeWithNonSimpleCollation",
            "results": {
                "end": "2017-09-27T18:39:14.623Z",
                "1": {
                    "ops_per_sec": 8747.263106951574,
                    "ops_per_sec_values": [
                        8747.263106951574
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:38:53.994Z",
                "2": {
                    "ops_per_sec": 13366.332873162864,
                    "ops_per_sec_values": [
                        13366.332873162864
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 23575.35117475162,
                    "ops_per_sec_values": [
                        23575.35117475162
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 41470.16093372451,
                    "ops_per_sec_values": [
                        41470.16093372451
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.StringRangeWithNonSimpleCollation",
            "results": {
                "end": "2017-09-27T18:39:35.211Z",
                "1": {
                    "ops_per_sec": 5692.91027874251,
                    "ops_per_sec_values": [
                        5692.91027874251
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:39:14.623Z",
                "2": {
                    "ops_per_sec": 10303.936852680708,
                    "ops_per_sec_values": [
                        10303.936852680708
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 17418.053264878166,
                    "ops_per_sec_values": [
                        17418.053264878166
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 30412.247540341596,
                    "ops_per_sec_values": [
                        30412.247540341596
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.StringRangeWithSimpleCollation",
            "results": {
                "end": "2017-09-27T18:39:55.798Z",
                "1": {
                    "ops_per_sec": 7802.211772720403,
                    "ops_per_sec_values": [
                        7802.211772720403
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:39:35.211Z",
                "2": {
                    "ops_per_sec": 13124.46139333384,
                    "ops_per_sec_values": [
                        13124.46139333384
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 22909.409911500814,
                    "ops_per_sec_values": [
                        22909.409911500814
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 40157.937247940055,
                    "ops_per_sec_values": [
                        40157.937247940055
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.StringRangeWithSimpleCollation",
            "results": {
                "end": "2017-09-27T18:40:16.438Z",
                "1": {
                    "ops_per_sec": 8929.09440239378,
                    "ops_per_sec_values": [
                        8929.09440239378
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:39:55.798Z",
                "2": {
                    "ops_per_sec": 14656.681122584116,
                    "ops_per_sec_values": [
                        14656.681122584116
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 23723.822218438007,
                    "ops_per_sec_values": [
                        23723.822218438007
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 41956.96178755053,
                    "ops_per_sec_values": [
                        41956.96178755053
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.StringRangeWithSimpleCollation",
            "results": {
                "end": "2017-09-27T18:40:38.347Z",
                "1": {
                    "ops_per_sec": 6572.333751179628,
                    "ops_per_sec_values": [
                        6572.333751179628
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:40:16.438Z",
                "2": {
                    "ops_per_sec": 11157.946541244464,
                    "ops_per_sec_values": [
                        11157.946541244464
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 17842.423505915896,
                    "ops_per_sec_values": [
                        17842.423505915896
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 33142.31275891027,
                    "ops_per_sec_values": [
                        33142.31275891027
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.StringUnindexedInPredWithNonSimpleCollation",
            "results": {
                "end": "2017-09-27T18:40:58.633Z",
                "1": {
                    "ops_per_sec": 5776.053503149066,
                    "ops_per_sec_values": [
                        5776.053503149066
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:40:38.347Z",
                "2": {
                    "ops_per_sec": 8940.086012873948,
                    "ops_per_sec_values": [
                        8940.086012873948
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 18801.614445178882,
                    "ops_per_sec_values": [
                        18801.614445178882
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 30591.847782536657,
                    "ops_per_sec_values": [
                        30591.847782536657
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.StringUnindexedInPredWithNonSimpleCollation",
            "results": {
                "end": "2017-09-27T18:41:18.897Z",
                "1": {
                    "ops_per_sec": 5256.643910995837,
                    "ops_per_sec_values": [
                        5256.643910995837
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:40:58.634Z",
                "2": {
                    "ops_per_sec": 8962.639312283987,
                    "ops_per_sec_values": [
                        8962.639312283987
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 16398.48479943018,
                    "ops_per_sec_values": [
                        16398.48479943018
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 27149.922565819055,
                    "ops_per_sec_values": [
                        27149.922565819055
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.StringUnindexedInPredWithSimpleCollation",
            "results": {
                "end": "2017-09-27T18:41:39.107Z",
                "1": {
                    "ops_per_sec": 6552.062379423922,
                    "ops_per_sec_values": [
                        6552.062379423922
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:41:18.897Z",
                "2": {
                    "ops_per_sec": 10943.535442034176,
                    "ops_per_sec_values": [
                        10943.535442034176
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 20224.47300522563,
                    "ops_per_sec_values": [
                        20224.47300522563
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 35539.090801917424,
                    "ops_per_sec_values": [
                        35539.090801917424
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.StringUnindexedInPredWithSimpleCollation",
            "results": {
                "end": "2017-09-27T18:41:59.280Z",
                "1": {
                    "ops_per_sec": 5915.355957824104,
                    "ops_per_sec_values": [
                        5915.355957824104
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:41:39.107Z",
                "2": {
                    "ops_per_sec": 9631.763492004478,
                    "ops_per_sec_values": [
                        9631.763492004478
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 18547.393664747757,
                    "ops_per_sec_values": [
                        18547.393664747757
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 31509.106811679725,
                    "ops_per_sec_values": [
                        31509.106811679725
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IntNonIdFindOneProjectionCovered",
            "results": {
                "end": "2017-09-27T18:42:19.764Z",
                "1": {
                    "ops_per_sec": 7803.498941810364,
                    "ops_per_sec_values": [
                        7803.498941810364
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:41:59.280Z",
                "2": {
                    "ops_per_sec": 12726.019979527551,
                    "ops_per_sec_values": [
                        12726.019979527551
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 23441.04320287701,
                    "ops_per_sec_values": [
                        23441.04320287701
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 39484.24306947629,
                    "ops_per_sec_values": [
                        39484.24306947629
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.IntNonIdFindOneProjectionCovered",
            "results": {
                "end": "2017-09-27T18:42:40.280Z",
                "1": {
                    "ops_per_sec": 8451.575359813658,
                    "ops_per_sec_values": [
                        8451.575359813658
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:42:19.764Z",
                "2": {
                    "ops_per_sec": 12197.818013184671,
                    "ops_per_sec_values": [
                        12197.818013184671
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 21465.900151576203,
                    "ops_per_sec_values": [
                        21465.900151576203
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 34345.845696944,
                    "ops_per_sec_values": [
                        34345.845696944
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.IntNonIdFindOneProjectionCovered",
            "results": {
                "end": "2017-09-27T18:43:00.781Z",
                "1": {
                    "ops_per_sec": 6292.717826808429,
                    "ops_per_sec_values": [
                        6292.717826808429
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:42:40.280Z",
                "2": {
                    "ops_per_sec": 10690.279539645726,
                    "ops_per_sec_values": [
                        10690.279539645726
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 19756.16244564282,
                    "ops_per_sec_values": [
                        19756.16244564282
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 33803.43721499419,
                    "ops_per_sec_values": [
                        33803.43721499419
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IntNonIdFindOneProjection",
            "results": {
                "end": "2017-09-27T18:43:21.363Z",
                "1": {
                    "ops_per_sec": 7739.82977971469,
                    "ops_per_sec_values": [
                        7739.82977971469
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:43:00.781Z",
                "2": {
                    "ops_per_sec": 14877.853952475305,
                    "ops_per_sec_values": [
                        14877.853952475305
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 24789.554238568428,
                    "ops_per_sec_values": [
                        24789.554238568428
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 45375.091216154105,
                    "ops_per_sec_values": [
                        45375.091216154105
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.IntNonIdFindOneProjection",
            "results": {
                "end": "2017-09-27T18:43:41.956Z",
                "1": {
                    "ops_per_sec": 8547.594597171767,
                    "ops_per_sec_values": [
                        8547.594597171767
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:43:21.363Z",
                "2": {
                    "ops_per_sec": 13454.158149078223,
                    "ops_per_sec_values": [
                        13454.158149078223
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 22528.9634402275,
                    "ops_per_sec_values": [
                        22528.9634402275
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 36536.02880042137,
                    "ops_per_sec_values": [
                        36536.02880042137
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.IntNonIdFindOneProjection",
            "results": {
                "end": "2017-09-27T18:44:02.565Z",
                "1": {
                    "ops_per_sec": 6401.0704497540055,
                    "ops_per_sec_values": [
                        6401.0704497540055
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:43:41.956Z",
                "2": {
                    "ops_per_sec": 11201.785249543555,
                    "ops_per_sec_values": [
                        11201.785249543555
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 20565.777732032522,
                    "ops_per_sec_values": [
                        20565.777732032522
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 35569.7167527429,
                    "ops_per_sec_values": [
                        35569.7167527429
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IntNonIdFindProjectionCovered",
            "results": {
                "end": "2017-09-27T18:44:22.863Z",
                "1": {
                    "ops_per_sec": 6157.698982792265,
                    "ops_per_sec_values": [
                        6157.698982792265
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:44:02.565Z",
                "2": {
                    "ops_per_sec": 9062.072045221808,
                    "ops_per_sec_values": [
                        9062.072045221808
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 16569.01280429103,
                    "ops_per_sec_values": [
                        16569.01280429103
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 27863.77337792027,
                    "ops_per_sec_values": [
                        27863.77337792027
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.IntNonIdFindProjectionCovered",
            "results": {
                "end": "2017-09-27T18:44:43.162Z",
                "1": {
                    "ops_per_sec": 8597.325409806244,
                    "ops_per_sec_values": [
                        8597.325409806244
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:44:22.863Z",
                "2": {
                    "ops_per_sec": 13933.93801542219,
                    "ops_per_sec_values": [
                        13933.93801542219
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 25450.718751499066,
                    "ops_per_sec_values": [
                        25450.718751499066
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 43240.95543115761,
                    "ops_per_sec_values": [
                        43240.95543115761
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.IntNonIdFindProjectionCovered",
            "results": {
                "end": "2017-09-27T18:45:03.450Z",
                "1": {
                    "ops_per_sec": 3709.343102842717,
                    "ops_per_sec_values": [
                        3709.343102842717
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:44:43.162Z",
                "2": {
                    "ops_per_sec": 6229.05767664503,
                    "ops_per_sec_values": [
                        6229.05767664503
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 10984.558816768917,
                    "ops_per_sec_values": [
                        10984.558816768917
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 17423.87692049517,
                    "ops_per_sec_values": [
                        17423.87692049517
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.FindProjection",
            "results": {
                "end": "2017-09-27T18:45:23.688Z",
                "1": {
                    "ops_per_sec": 6191.192367720806,
                    "ops_per_sec_values": [
                        6191.192367720806
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:45:03.450Z",
                "2": {
                    "ops_per_sec": 9888.807136779275,
                    "ops_per_sec_values": [
                        9888.807136779275
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 18905.047442001396,
                    "ops_per_sec_values": [
                        18905.047442001396
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 31087.137695529676,
                    "ops_per_sec_values": [
                        31087.137695529676
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.FindProjection",
            "results": {
                "end": "2017-09-27T18:45:43.944Z",
                "1": {
                    "ops_per_sec": 8568.810035190329,
                    "ops_per_sec_values": [
                        8568.810035190329
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:45:23.688Z",
                "2": {
                    "ops_per_sec": 13990.719095216726,
                    "ops_per_sec_values": [
                        13990.719095216726
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 25082.01118158057,
                    "ops_per_sec_values": [
                        25082.01118158057
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 42816.235534846324,
                    "ops_per_sec_values": [
                        42816.235534846324
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.FindProjection",
            "results": {
                "end": "2017-09-27T18:46:04.260Z",
                "1": {
                    "ops_per_sec": 3995.1635074685187,
                    "ops_per_sec_values": [
                        3995.1635074685187
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:45:43.944Z",
                "2": {
                    "ops_per_sec": 6639.350701766555,
                    "ops_per_sec_values": [
                        6639.350701766555
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 12151.927371024793,
                    "ops_per_sec_values": [
                        12151.927371024793
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 20110.891871033546,
                    "ops_per_sec_values": [
                        20110.891871033546
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.FindWideDocProjection",
            "results": {
                "end": "2017-09-27T18:46:24.486Z",
                "1": {
                    "ops_per_sec": 4512.135810250416,
                    "ops_per_sec_values": [
                        4512.135810250416
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:46:04.260Z",
                "2": {
                    "ops_per_sec": 6685.222625529583,
                    "ops_per_sec_values": [
                        6685.222625529583
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 13698.63287444079,
                    "ops_per_sec_values": [
                        13698.63287444079
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 23162.101140881936,
                    "ops_per_sec_values": [
                        23162.101140881936
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.FindWideDocProjection",
            "results": {
                "end": "2017-09-27T18:46:44.770Z",
                "1": {
                    "ops_per_sec": 8033.662970233163,
                    "ops_per_sec_values": [
                        8033.662970233163
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:46:24.486Z",
                "2": {
                    "ops_per_sec": 12962.521379505535,
                    "ops_per_sec_values": [
                        12962.521379505535
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 24363.999016694215,
                    "ops_per_sec_values": [
                        24363.999016694215
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 42449.934535618544,
                    "ops_per_sec_values": [
                        42449.934535618544
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.FindWideDocProjection",
            "results": {
                "end": "2017-09-27T18:47:05.045Z",
                "1": {
                    "ops_per_sec": 3357.727180318765,
                    "ops_per_sec_values": [
                        3357.727180318765
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:46:44.770Z",
                "2": {
                    "ops_per_sec": 5797.229499604403,
                    "ops_per_sec_values": [
                        5797.229499604403
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 10647.728310732737,
                    "ops_per_sec_values": [
                        10647.728310732737
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 17159.922249442112,
                    "ops_per_sec_values": [
                        17159.922249442112
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.FindProjectionThreeFieldsCovered",
            "results": {
                "end": "2017-09-27T18:47:25.653Z",
                "1": {
                    "ops_per_sec": 8047.192607136497,
                    "ops_per_sec_values": [
                        8047.192607136497
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:47:05.045Z",
                "2": {
                    "ops_per_sec": 13188.587081013207,
                    "ops_per_sec_values": [
                        13188.587081013207
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 25142.496667948584,
                    "ops_per_sec_values": [
                        25142.496667948584
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 41603.155635663155,
                    "ops_per_sec_values": [
                        41603.155635663155
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.FindProjectionThreeFieldsCovered",
            "results": {
                "end": "2017-09-27T18:47:46.283Z",
                "1": {
                    "ops_per_sec": 8905.012137746633,
                    "ops_per_sec_values": [
                        8905.012137746633
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:47:25.653Z",
                "2": {
                    "ops_per_sec": 13161.313481137535,
                    "ops_per_sec_values": [
                        13161.313481137535
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 24647.902807543123,
                    "ops_per_sec_values": [
                        24647.902807543123
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 41257.77999540798,
                    "ops_per_sec_values": [
                        41257.77999540798
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.FindProjectionThreeFieldsCovered",
            "results": {
                "end": "2017-09-27T18:48:06.936Z",
                "1": {
                    "ops_per_sec": 6237.886906814517,
                    "ops_per_sec_values": [
                        6237.886906814517
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:47:46.283Z",
                "2": {
                    "ops_per_sec": 10599.530046859396,
                    "ops_per_sec_values": [
                        10599.530046859396
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 17673.114536668352,
                    "ops_per_sec_values": [
                        17673.114536668352
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 31922.858437063725,
                    "ops_per_sec_values": [
                        31922.858437063725
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.FindProjectionThreeFields",
            "results": {
                "end": "2017-09-27T18:48:27.180Z",
                "1": {
                    "ops_per_sec": 6018.651041774943,
                    "ops_per_sec_values": [
                        6018.651041774943
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:48:06.936Z",
                "2": {
                    "ops_per_sec": 10128.35243068465,
                    "ops_per_sec_values": [
                        10128.35243068465
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 18461.93266967993,
                    "ops_per_sec_values": [
                        18461.93266967993
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 30778.43423607283,
                    "ops_per_sec_values": [
                        30778.43423607283
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.FindProjectionThreeFields",
            "results": {
                "end": "2017-09-27T18:48:47.434Z",
                "1": {
                    "ops_per_sec": 8592.093642666296,
                    "ops_per_sec_values": [
                        8592.093642666296
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:48:27.180Z",
                "2": {
                    "ops_per_sec": 14198.256661654592,
                    "ops_per_sec_values": [
                        14198.256661654592
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 27048.716832971117,
                    "ops_per_sec_values": [
                        27048.716832971117
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 43656.27851871627,
                    "ops_per_sec_values": [
                        43656.27851871627
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.FindProjectionThreeFields",
            "results": {
                "end": "2017-09-27T18:49:07.677Z",
                "1": {
                    "ops_per_sec": 3660.1569004181865,
                    "ops_per_sec_values": [
                        3660.1569004181865
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:48:47.434Z",
                "2": {
                    "ops_per_sec": 6120.540574137683,
                    "ops_per_sec_values": [
                        6120.540574137683
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 11467.592399202369,
                    "ops_per_sec_values": [
                        11467.592399202369
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 18273.587290232794,
                    "ops_per_sec_values": [
                        18273.587290232794
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.FindProjectionDottedField",
            "results": {
                "end": "2017-09-27T18:49:27.873Z",
                "1": {
                    "ops_per_sec": 5879.120516673366,
                    "ops_per_sec_values": [
                        5879.120516673366
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:49:07.677Z",
                "2": {
                    "ops_per_sec": 8907.1023941973,
                    "ops_per_sec_values": [
                        8907.1023941973
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 16525.212251578658,
                    "ops_per_sec_values": [
                        16525.212251578658
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 28411.169613229973,
                    "ops_per_sec_values": [
                        28411.169613229973
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.FindProjectionDottedField",
            "results": {
                "end": "2017-09-27T18:49:48.135Z",
                "1": {
                    "ops_per_sec": 8955.968586743278,
                    "ops_per_sec_values": [
                        8955.968586743278
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:49:27.873Z",
                "2": {
                    "ops_per_sec": 14284.192366986515,
                    "ops_per_sec_values": [
                        14284.192366986515
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 25351.50068964029,
                    "ops_per_sec_values": [
                        25351.50068964029
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 44307.653450767735,
                    "ops_per_sec_values": [
                        44307.653450767735
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.FindProjectionDottedField",
            "results": {
                "end": "2017-09-27T18:50:08.407Z",
                "1": {
                    "ops_per_sec": 3177.5040311021567,
                    "ops_per_sec_values": [
                        3177.5040311021567
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:49:48.135Z",
                "2": {
                    "ops_per_sec": 5580.30404731455,
                    "ops_per_sec_values": [
                        5580.30404731455
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 10113.252437973384,
                    "ops_per_sec_values": [
                        10113.252437973384
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 17406.2948173575,
                    "ops_per_sec_values": [
                        17406.2948173575
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.FindProjectionDottedField.Indexed",
            "results": {
                "end": "2017-09-27T18:50:28.696Z",
                "1": {
                    "ops_per_sec": 8439.988445765564,
                    "ops_per_sec_values": [
                        8439.988445765564
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:50:08.407Z",
                "2": {
                    "ops_per_sec": 14065.19073181409,
                    "ops_per_sec_values": [
                        14065.19073181409
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 27968.648250625312,
                    "ops_per_sec_values": [
                        27968.648250625312
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 46766.62943373304,
                    "ops_per_sec_values": [
                        46766.62943373304
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.FindProjectionDottedField.Indexed",
            "results": {
                "end": "2017-09-27T18:50:49.044Z",
                "1": {
                    "ops_per_sec": 9237.0622755554,
                    "ops_per_sec_values": [
                        9237.0622755554
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:50:28.696Z",
                "2": {
                    "ops_per_sec": 13642.462531954687,
                    "ops_per_sec_values": [
                        13642.462531954687
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 25255.46873376089,
                    "ops_per_sec_values": [
                        25255.46873376089
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 42179.44798454213,
                    "ops_per_sec_values": [
                        42179.44798454213
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Aggregation.FindProjectionDottedField.Indexed",
            "results": {
                "end": "2017-09-27T18:51:09.321Z",
                "1": {
                    "ops_per_sec": 6209.788297492537,
                    "ops_per_sec_values": [
                        6209.788297492537
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:50:49.044Z",
                "2": {
                    "ops_per_sec": 10414.296994472708,
                    "ops_per_sec_values": [
                        10414.296994472708
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 19828.690888252517,
                    "ops_per_sec_values": [
                        19828.690888252517
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 35085.9592411805,
                    "ops_per_sec_values": [
                        35085.9592411805
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.LargeDocs",
            "results": {
                "end": "2017-09-27T18:51:49.390Z",
                "1": {
                    "ops_per_sec": 1.8206867521187786,
                    "ops_per_sec_values": [
                        1.8206867521187786
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:51:09.321Z",
                "2": {
                    "ops_per_sec": 2.352679294521967,
                    "ops_per_sec_values": [
                        2.352679294521967
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 2.319763105791637,
                    "ops_per_sec_values": [
                        2.319763105791637
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 2.5198441431929597,
                    "ops_per_sec_values": [
                        2.5198441431929597
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        },
        {
            "name": "Queries.IdentityView.LargeDocs",
            "results": {
                "end": "2017-09-27T18:52:24.971Z",
                "1": {
                    "ops_per_sec": 7650.820670248349,
                    "ops_per_sec_values": [
                        7650.820670248349
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:51:49.390Z",
                "2": {
                    "ops_per_sec": 13541.05451681638,
                    "ops_per_sec_values": [
                        13541.05451681638
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 23699.22682848976,
                    "ops_per_sec_values": [
                        23699.22682848976
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 44404.024330129185,
                    "ops_per_sec_values": [
                        44404.024330129185
                    ],
                    "error_values": [
                        0
                    ]
                }
                    "error_values": [
            }
        },
        {
            "name": "Aggregation.LargeDocs",
            "results": {
                "end": "2017-09-27T18:53:03.695Z",
                "1": {
                    "ops_per_sec": 1.3797148799490373,
                    "ops_per_sec_values": [
                        1.3797148799490373
                    ],
                    "error_values": [
                        0
                    ]
                },
                "start": "2017-09-27T18:52:24.971Z",
                "2": {
                    "ops_per_sec": 2.0506836723028,
                    "ops_per_sec_values": [
                        2.0506836723028
                    ],
                    "error_values": [
                        0
                    ]
                },
                "4": {
                    "ops_per_sec": 2.384774509349679,
                    "ops_per_sec_values": [
                        2.384774509349679
                    ],
                    "error_values": [
                        0
                    ]
                },
                "8": {
                    "ops_per_sec": 2.395316796365586,
                    "ops_per_sec_values": [
                        2.395316796365586
                    ],
                    "error_values": [
                        0
                    ]
                }
            }
        }
    ]
}
```

Server:
- Max Network write 459.06M/s, second Network write 33.31M/s.
- Max CPU 26.28%.
- Max disk write 6.63M/s.
- Max connection 18 based on mongostat.

Clinet:
- Max CPU 8.726%.
- Max network incoming 391.87M/s.

## Compare data centers

- Server: n1-standard-8 (8 vCPUs, 30 GB memory) in various zones, Debian 8 Jessie with MongoDB CE v3.4.9.
- Testing Client: n1-standard-8 (8 vCPUs, 30 GB memory) in us-central1-a
- Testing tool: YCSB

### us-west1-a

`./bin/ycsb load mongodb -s  -P workloads/workloada -p recordcount=100000 -threads 8 -p mongodb.url="mongodb://10.240.0.20:27017/test"  -p table=yc
sbtest` result:

```
[OVERALL], RunTime(ms), 430853
[OVERALL], Throughput(ops/sec), 232.09772242504985
[TOTAL_GCS_PS_Scavenge], Count, 10
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 42
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.009748104341852094
[TOTAL_GCS_PS_MarkSweep], Count, 0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0
[TOTAL_GCs], Count, 10
[TOTAL_GC_TIME], Time(ms), 42
[TOTAL_GC_TIME_%], Time(%), 0.009748104341852094
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 899.25
[CLEANUP], MinLatency(us), 0
[CLEANUP], MaxLatency(us), 7187
[CLEANUP], 95thPercentileLatency(us), 7187
[CLEANUP], 99thPercentileLatency(us), 7187
[CLEANUP], 0, 2.0
[CLEANUP], 1, 4.0
[CLEANUP], 4, 1.0
[CLEANUP], 7187, 1.0
[INSERT], Operations, 100000
[INSERT], AverageLatency(us), 34425.33856
[INSERT], MinLatency(us), 33856
[INSERT], MaxLatency(us), 397567
[INSERT], 95thPercentileLatency(us), 34879
[INSERT], 99thPercentileLatency(us), 35711
[INSERT], Return=OK, 100000
```

### us-east1-b

`./bin/ycsb load mongodb -s  -P workloads/workloada -p recordcount=100000 -threads 8 -p mongodb.url="mongodb://10.240.0.21:27017/test"  -p table=yc
sbtest` result:

```
[OVERALL], RunTime(ms), 456228
[OVERALL], Throughput(ops/sec), 219.1886512883909
[TOTAL_GCS_PS_Scavenge], Count, 10
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 48
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.010521055261842762
[TOTAL_GCS_PS_MarkSweep], Count, 0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0
[TOTAL_GCs], Count, 10
[TOTAL_GC_TIME], Time(ms), 48
[TOTAL_GC_TIME_%], Time(%), 0.010521055261842762
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 881.75
[CLEANUP], MinLatency(us), 0
[CLEANUP], MaxLatency(us), 7047
[CLEANUP], 95thPercentileLatency(us), 7047
[CLEANUP], 99thPercentileLatency(us), 7047
[CLEANUP], 0, 2.0
[CLEANUP], 1, 4.0
[CLEANUP], 4, 1.0
[CLEANUP], 7047, 1.0
[INSERT], Operations, 100000
[INSERT], AverageLatency(us), 36456.46464
[INSERT], MinLatency(us), 35872
[INSERT], MaxLatency(us), 512767
[INSERT], 95thPercentileLatency(us), 36831
[INSERT], 99thPercentileLatency(us), 37439
[INSERT], Return=OK, 100000
```

### europe-west1-b  

`./bin/ycsb load mongodb -s  -P workloads/workloada -p recordcount=100000 -threads 8 -p mongodb.url="mongodb://10.240.0.22:27017/test"  -p table=yc
sbtest` result:

```
[OVERALL], RunTime(ms), 1318174
[OVERALL], Throughput(ops/sec), 75.86251890873284
[TOTAL_GCS_PS_Scavenge], Count, 10
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 40
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.0030345007563493133
[TOTAL_GCS_PS_MarkSweep], Count, 0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0
[TOTAL_GCs], Count, 10
[TOTAL_GC_TIME], Time(ms), 40
[TOTAL_GC_TIME_%], Time(%), 0.0030345007563493133
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 889.375
[CLEANUP], MinLatency(us), 1
[CLEANUP], MaxLatency(us), 7103
[CLEANUP], 95thPercentileLatency(us), 7103
[CLEANUP], 99thPercentileLatency(us), 7103
[CLEANUP], 1, 4.0
[CLEANUP], 2, 2.0
[CLEANUP], 5, 1.0
[CLEANUP], 7103, 1.0
[INSERT], Operations, 100000
[INSERT], AverageLatency(us), 105393.23232
[INSERT], MinLatency(us), 104768
[INSERT], MaxLatency(us), 1171455
[INSERT], 95thPercentileLatency(us), 105791
[INSERT], 99thPercentileLatency(us), 106239
[INSERT], Return=OK, 100000
```

### asia-east1-a

`./bin/ycsb load mongodb -s  -P workloads/workloada -p recordcount=100000 -threads 8 -p mongodb.url="mongodb://10.240.0.23:27017/test"  -p table=yc
sbtest` result:

```
[OVERALL], RunTime(ms), 1937866
[OVERALL], Throughput(ops/sec), 51.60315522332297
[TOTAL_GCS_PS_Scavenge], Count, 10
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 42
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.002167332519379565
[TOTAL_GCS_PS_MarkSweep], Count, 0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0
[TOTAL_GCs], Count, 10
[TOTAL_GC_TIME], Time(ms), 42
[TOTAL_GC_TIME_%], Time(%), 0.002167332519379565
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 870.5
[CLEANUP], MinLatency(us), 1
[CLEANUP], MaxLatency(us), 6951
[CLEANUP], 95thPercentileLatency(us), 6951
[CLEANUP], 99thPercentileLatency(us), 6951
[CLEANUP], 1, 4.0
[CLEANUP], 2, 2.0
[CLEANUP], 6, 1.0
[CLEANUP], 6951, 1.0
[INSERT], Operations, 100000
[INSERT], AverageLatency(us), 154379.92512
[INSERT], MinLatency(us), 150656
[INSERT], MaxLatency(us), 5726207
[INSERT], 95thPercentileLatency(us), 156031
[INSERT], 99thPercentileLatency(us), 156287
[INSERT], Return=OK, 100000
```


### us-central1-a (same zone)

`./bin/ycsb load mongodb -s  -P workloads/workloada -p recordcount=100000 -threads 8 -p mongodb.url="mongodb://10.240.0.24:27017/test"  -p table=yc
sbtest` result:

```
[OVERALL], RunTime(ms), 5090
[OVERALL], Throughput(ops/sec), 19646.365422396855
[TOTAL_GCS_PS_Scavenge], Count, 10
[TOTAL_GC_TIME_PS_Scavenge], Time(ms), 40
[TOTAL_GC_TIME_%_PS_Scavenge], Time(%), 0.7858546168958742
[TOTAL_GCS_PS_MarkSweep], Count, 0
[TOTAL_GC_TIME_PS_MarkSweep], Time(ms), 0
[TOTAL_GC_TIME_%_PS_MarkSweep], Time(%), 0.0
[TOTAL_GCs], Count, 10
[TOTAL_GC_TIME], Time(ms), 40
[TOTAL_GC_TIME_%], Time(%), 0.7858546168958742
[CLEANUP], Operations, 8
[CLEANUP], AverageLatency(us), 911.375
[CLEANUP], MinLatency(us), 0
[CLEANUP], MaxLatency(us), 7283
[CLEANUP], 95thPercentileLatency(us), 7283
[CLEANUP], 99thPercentileLatency(us), 7283
[CLEANUP], 0, 3.0
[CLEANUP], 1, 3.0
[CLEANUP], 6, 1.0
[CLEANUP], 7283, 1.0
[INSERT], Operations, 100000
[INSERT], AverageLatency(us), 370.12481
[INSERT], MinLatency(us), 101
[INSERT], MaxLatency(us), 126527
[INSERT], 95thPercentileLatency(us), 535
[INSERT], 99thPercentileLatency(us), 1260
[INSERT], Return=OK, 100000
```
