# Check how MongoDB connection affected when 

Tool to check MongoDB connection liveness

```shell
# test writing
node write.js
# test reading
node read.js
```

## Test Step Down Primary

- Providor: mlab
- Database plan: GCP M2 Standard
- Database version: WireTiger v3.4.10
- replSetStepDown: 20 seconds
- connection options:
```json
{
  "db": {
    "safe": true
  },
  "server": {
    "sslValidate": true,
    "sslCA": "-----BEGIN CERTIFICATE-----\nMIIDrzCCApegAwIBAgIQCDvgVpBCRrGhdWrJWZHHSjANBgkqhkiG9w0BAQUFADBh\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD\nQTAeFw0wNjExMTAwMDAwMDBaFw0zMTExMTAwMDAwMDBaMGExCzAJBgNVBAYTAlVT\nMRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\nb20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IENBMIIBIjANBgkqhkiG\n9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4jvhEXLeqKTTo1eqUKKPC3eQyaKl7hLOllsB\nCSDMAZOnTjC3U/dDxGkAV53ijSLdhwZAAIEJzs4bg7/fzTtxRuLWZscFs3YnFo97\nnh6Vfe63SKMI2tavegw5BmV/Sl0fvBf4q77uKNd0f3p4mVmFaG5cIzJLv07A6Fpt\n43C/dxC//AH2hdmoRBBYMql1GNXRor5H4idq9Joz+EkIYIvUX7Q6hL+hqkpMfT7P\nT19sdl6gSzeRntwi5m3OFBqOasv+zbMUZBfHWymeMr/y7vrTC0LUq7dBMtoM1O/4\ngdW7jVg/tRvoSSiicNoxBN33shbyTApOB6jtSj1etX+jkMOvJwIDAQABo2MwYTAO\nBgNVHQ8BAf8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUA95QNVbR\nTLtm8KPiGxvDl7I90VUwHwYDVR0jBBgwFoAUA95QNVbRTLtm8KPiGxvDl7I90VUw\nDQYJKoZIhvcNAQEFBQADggEBAMucN6pIExIK+t1EnE9SsPTfrgT1eXkIoyQY/Esr\nhMAtudXH/vTBH1jLuG2cenTnmCmrEbXjcKChzUyImZOMkXDiqw8cvpOp/2PV5Adg\n06O/nVsJ8dWO41P0jmP6P6fbtGbfYmbW0W5BjfIttep3Sp+dWOIrWcBAI+0tKIJF\nPnlUkiaY4IBIqDfv8NZ5YBberOgOzW6sRBc4L0na4UU+Krk2U886UAb3LujEV0ls\nYSEY1QSteDwsOoBrp+uvFRTp2InBuThs4pFsiv9kuXclVzDAGySj4dzp30d8tbQk\nCAUw7C29C79Fv1C5qfPrmAESrciIxpg0X40KPMbp1ZWVbd4=\n-----END CERTIFICATE-----\n",
    "socketOptions": {
      "keepAlive": 1,
      "connectTimeoutMS": 30000
    }
  },
  "replset": {
    "socketOptions": {
      "keepAlive": 1,
      "connectTimeoutMS": 30000
    },
    "ha": true,
    "haInterval": 10000
  }
}
```

### Writing

```
(node:47616) DeprecationWarning: `openSet()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, or set the `useMongoClient` option if using `connect()` or `createConnection()`. See http://mongoosejs.com/docs/connections.html#use-mongo-client
Db.prototype.authenticate method will no longer be available in the next major release 3.x as MongoDB 3.6 will only allow auth against users in the admin db and will no longer allow multiple credentials on a socket. Please authenticate using MongoClient.connect with auth credentials.
MongoDB connected
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:32.528Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:33.533Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:34.536Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:35.540Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:36.541Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:37.544Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:38.549Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:39.554Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:40.556Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:41.558Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:42.563Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:43.567Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:44.573Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:45.579Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:46.584Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:47.586Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:48.589Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:49.593Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:50.594Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:51.598Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:52.601Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:53.602Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:54.603Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:55.604Z
MongoDB reconnected
        success
        success
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:56.610Z
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:57.615Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:58.619Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:09:59.622Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:10:00.626Z
        success
```

### Reading

```
tjia@tfeng-mac:~/Projects/esna/Logan/devops/load-test/utils/mongo-liveness$ node read.js 
(node:47619) DeprecationWarning: `openSet()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, or set the `useMongoClient` option if using `connect()` or `createConnection()`. See http://mongoosejs.com/docs/connections.html#use-mongo-client
Db.prototype.authenticate method will no longer be available in the next major release 3.x as MongoDB 3.6 will only allow auth against users in the admin db and will no longer allow multiple credentials on a socket. Please authenticate using MongoClient.connect with auth credentials.
MongoDB connected
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:32.553Z
        success 2018-01-04T21:36:58.585Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:33.556Z
        success 2018-01-04T22:00:26.672Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:34.558Z
        success 2018-01-05T21:09:31.527Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:35.564Z
        success 2018-01-04T21:59:59.284Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:36.566Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): MongoError: no connection available
(node:47619) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:37.570Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 2): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:38.575Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 3): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:39.580Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 4): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:40.581Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 5): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:41.584Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 6): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:42.589Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 7): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:43.590Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 8): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:44.595Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 9): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:45.596Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 10): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:46.597Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 11): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:47.600Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 12): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:48.603Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 13): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:49.604Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 14): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:50.604Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 15): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:51.606Z
!!!!! READ ERROR !!!! no connection available
(node:47619) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 16): MongoError: no connection available
MongoDB reconnected
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:52.607Z
        success 2018-01-04T21:36:04.363Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:53.611Z
        success 2018-01-05T20:07:24.369Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:54.612Z
        success 2018-01-04T21:36:02.278Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:09:55.615Z
        success 2018-01-05T20:42:51.079Z
```

## Test replSetStepDown

- Providor: mlab
- Database plan: GCP M2 Standard
- Database version: WireTiger v3.4.10
- replSetStepDown: 20 seconds
- connection options:
```json
{
  "db": {
    "safe": true
  },
  "server": {
    "sslValidate": true,
    "sslCA": "-----BEGIN CERTIFICATE-----\nMIIDrzCCApegAwIBAgIQCDvgVpBCRrGhdWrJWZHHSjANBgkqhkiG9w0BAQUFADBh\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD\nQTAeFw0wNjExMTAwMDAwMDBaFw0zMTExMTAwMDAwMDBaMGExCzAJBgNVBAYTAlVT\nMRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\nb20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IENBMIIBIjANBgkqhkiG\n9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4jvhEXLeqKTTo1eqUKKPC3eQyaKl7hLOllsB\nCSDMAZOnTjC3U/dDxGkAV53ijSLdhwZAAIEJzs4bg7/fzTtxRuLWZscFs3YnFo97\nnh6Vfe63SKMI2tavegw5BmV/Sl0fvBf4q77uKNd0f3p4mVmFaG5cIzJLv07A6Fpt\n43C/dxC//AH2hdmoRBBYMql1GNXRor5H4idq9Joz+EkIYIvUX7Q6hL+hqkpMfT7P\nT19sdl6gSzeRntwi5m3OFBqOasv+zbMUZBfHWymeMr/y7vrTC0LUq7dBMtoM1O/4\ngdW7jVg/tRvoSSiicNoxBN33shbyTApOB6jtSj1etX+jkMOvJwIDAQABo2MwYTAO\nBgNVHQ8BAf8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUA95QNVbR\nTLtm8KPiGxvDl7I90VUwHwYDVR0jBBgwFoAUA95QNVbRTLtm8KPiGxvDl7I90VUw\nDQYJKoZIhvcNAQEFBQADggEBAMucN6pIExIK+t1EnE9SsPTfrgT1eXkIoyQY/Esr\nhMAtudXH/vTBH1jLuG2cenTnmCmrEbXjcKChzUyImZOMkXDiqw8cvpOp/2PV5Adg\n06O/nVsJ8dWO41P0jmP6P6fbtGbfYmbW0W5BjfIttep3Sp+dWOIrWcBAI+0tKIJF\nPnlUkiaY4IBIqDfv8NZ5YBberOgOzW6sRBc4L0na4UU+Krk2U886UAb3LujEV0ls\nYSEY1QSteDwsOoBrp+uvFRTp2InBuThs4pFsiv9kuXclVzDAGySj4dzp30d8tbQk\nCAUw7C29C79Fv1C5qfPrmAESrciIxpg0X40KPMbp1ZWVbd4=\n-----END CERTIFICATE-----\n",
    "socketOptions": {
      "keepAlive": 1,
      "connectTimeoutMS": 30000
    }
  },
  "replset": {
    "socketOptions": {
      "keepAlive": 1,
      "connectTimeoutMS": 30000
    },
    "ha": true,
    "haInterval": 10000
  }
}
```

### Writing

```
(node:47104) DeprecationWarning: `openSet()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, or set the `useMongoClient` option if using `connect()` or `createConnection()`. See http://mongoosejs.com/docs/connections.html#use-mongo-client
Db.prototype.authenticate method will no longer be available in the next major release 3.x as MongoDB 3.6 will only allow auth against users in the admin db and will no longer allow multiple credentials on a socket. Please authenticate using MongoClient.connect with auth credentials.
MongoDB connected
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:41.771Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:42.776Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:43.782Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:44.792Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:45.794Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:46.794Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:47.799Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:48.800Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:49.803Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:50.809Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:51.813Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:52.817Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:53.822Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:54.825Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:55.828Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:56.832Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:57.833Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:58.837Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:51:59.841Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:52:00.844Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:52:01.850Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:52:02.853Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:52:03.854Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:52:04.857Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:52:05.863Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:52:06.865Z
MongoDB reconnected
        success
        success
        success
        success
        success
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:52:07.866Z
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:52:08.872Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:52:09.873Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T20:52:10.879Z
        success
```

### Reading

```
(node:47102) DeprecationWarning: `openSet()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, or set the `useMongoClient` option if using `connect()` or `createConnection()`. See http://mongoosejs.com/docs/connections.html#use-mongo-client
Db.prototype.authenticate method will no longer be available in the next major release 3.x as MongoDB 3.6 will only allow auth against users in the admin db and will no longer allow multiple credentials on a socket. Please authenticate using MongoClient.connect with auth credentials.
MongoDB connected
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:43.403Z
        success 2018-01-05T20:06:46.250Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:44.407Z
        success 2018-01-05T20:13:33.474Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:45.410Z
        success 2018-01-05T20:08:06.496Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:46.414Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): MongoError: no connection available
(node:47102) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:47.420Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 2): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:48.424Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 3): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:49.427Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 4): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:50.427Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 5): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:51.433Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 6): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:52.439Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 7): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:53.442Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 8): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:54.442Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 9): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:55.444Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 10): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:56.448Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 11): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:57.454Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 12): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:58.457Z
!!!!! READ ERROR !!!! no connection available
(node:47102) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 13): MongoError: no connection available
MongoDB reconnected
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:51:59.457Z
        success 2018-01-04T21:33:39.341Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:52:00.463Z
        success 2018-01-04T21:56:30.993Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:52:01.464Z
        success 2018-01-04T21:34:49.259Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:52:02.464Z
        success 2018-01-05T20:42:50.078Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T20:52:03.463Z
        success 2018-01-05T20:06:49.257Z
```

## Test Change Plan

- Providor: mlab
- Database plan: GCP M2 Standard ==> GCP M4 Standard
- Failover Preference: Failover as necessary without coordinating with me
- Database version: WireTiger v3.4.10
- replSetStepDown: 20 seconds
- connection options:
```json
{
  "db": {
    "safe": true
  },
  "server": {
    "sslValidate": true,
    "sslCA": "-----BEGIN CERTIFICATE-----\nMIIDrzCCApegAwIBAgIQCDvgVpBCRrGhdWrJWZHHSjANBgkqhkiG9w0BAQUFADBh\nMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\nd3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD\nQTAeFw0wNjExMTAwMDAwMDBaFw0zMTExMTAwMDAwMDBaMGExCzAJBgNVBAYTAlVT\nMRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\nb20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IENBMIIBIjANBgkqhkiG\n9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4jvhEXLeqKTTo1eqUKKPC3eQyaKl7hLOllsB\nCSDMAZOnTjC3U/dDxGkAV53ijSLdhwZAAIEJzs4bg7/fzTtxRuLWZscFs3YnFo97\nnh6Vfe63SKMI2tavegw5BmV/Sl0fvBf4q77uKNd0f3p4mVmFaG5cIzJLv07A6Fpt\n43C/dxC//AH2hdmoRBBYMql1GNXRor5H4idq9Joz+EkIYIvUX7Q6hL+hqkpMfT7P\nT19sdl6gSzeRntwi5m3OFBqOasv+zbMUZBfHWymeMr/y7vrTC0LUq7dBMtoM1O/4\ngdW7jVg/tRvoSSiicNoxBN33shbyTApOB6jtSj1etX+jkMOvJwIDAQABo2MwYTAO\nBgNVHQ8BAf8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUA95QNVbR\nTLtm8KPiGxvDl7I90VUwHwYDVR0jBBgwFoAUA95QNVbRTLtm8KPiGxvDl7I90VUw\nDQYJKoZIhvcNAQEFBQADggEBAMucN6pIExIK+t1EnE9SsPTfrgT1eXkIoyQY/Esr\nhMAtudXH/vTBH1jLuG2cenTnmCmrEbXjcKChzUyImZOMkXDiqw8cvpOp/2PV5Adg\n06O/nVsJ8dWO41P0jmP6P6fbtGbfYmbW0W5BjfIttep3Sp+dWOIrWcBAI+0tKIJF\nPnlUkiaY4IBIqDfv8NZ5YBberOgOzW6sRBc4L0na4UU+Krk2U886UAb3LujEV0ls\nYSEY1QSteDwsOoBrp+uvFRTp2InBuThs4pFsiv9kuXclVzDAGySj4dzp30d8tbQk\nCAUw7C29C79Fv1C5qfPrmAESrciIxpg0X40KPMbp1ZWVbd4=\n-----END CERTIFICATE-----\n",
    "socketOptions": {
      "keepAlive": 1,
      "connectTimeoutMS": 30000
    }
  },
  "replset": {
    "socketOptions": {
      "keepAlive": 1,
      "connectTimeoutMS": 30000
    },
    "ha": true,
    "haInterval": 10000
  }
}
```
- Task started at: Jan 5, 13:23 PST
- Task ended at: Jan 5, 14:04 PST

### Writing

```
(node:47777) DeprecationWarning: `openSet()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, or set the `useMongoClient` option if using `connect()` or `createConnection()`. See http://mongoosejs.com/docs/connections.html#use-mongo-client
Db.prototype.authenticate method will no longer be available in the next major release 3.x as MongoDB 3.6 will only allow auth against users in the admin db and will no longer allow multiple credentials on a socket. Please authenticate using MongoClient.connect with auth credentials.
MongoDB connected
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:22:44.459Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:22:45.468Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:22:46.471Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:22:47.473Z
        success
.
.
.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:36.893Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:37.894Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:38.897Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:39.898Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:40.904Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:41.905Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:42.906Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:43.910Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:44.913Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:45.913Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:46.919Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:47.921Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:48.925Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:49.930Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:50.931Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:51.934Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:52.934Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:53.935Z
MongoDB reconnected
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:54.939Z
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:55.940Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:56.941Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:57.947Z
        success
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    writing @ 2018-01-05T21:59:58.952Z
        success
```

### Reading

```
(node:47778) DeprecationWarning: `openSet()` is deprecated in mongoose >= 4.11.0, use `openUri()` instead, or set the `useMongoClient` option if using `connect()` or `createConnection()`. See http://mongoosejs.com/docs/connections.html#use-mongo-client
Db.prototype.authenticate method will no longer be available in the next major release 3.x as MongoDB 3.6 will only allow auth against users in the admin db and will no longer allow multiple credentials on a socket. Please authenticate using MongoClient.connect with auth credentials.
MongoDB connected
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:22:47.084Z
        success 2018-01-04T22:00:19.304Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:22:48.086Z
        success 2018-01-04T21:35:14.320Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:22:49.090Z
        success 2018-01-05T20:07:36.404Z
.
.
.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:35.116Z
        success 2018-01-05T21:58:11.635Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:36.121Z
        success 2018-01-05T21:52:50.615Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:37.122Z
!!!!! READ ERROR !!!! connection 3 to ds141587-a1.ghp77.fleet.mlab.com:41587 closed
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): MongoError: connection 3 to ds141587-a1.ghp77.fleet.mlab.com:41587 closed
(node:47778) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:38.124Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 2): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:39.133Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 3): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:40.138Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 4): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:41.145Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 5): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:42.150Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 6): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:43.152Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 7): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:44.155Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 8): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:45.160Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 9): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:46.164Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 10): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:47.164Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 11): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:48.164Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 12): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:49.166Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 13): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:50.169Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 14): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:51.169Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 15): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:52.173Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 16): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:53.174Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 17): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:54.180Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 18): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:55.184Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 19): MongoError: no connection available
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:56.185Z
!!!!! READ ERROR !!!! no connection available
(node:47778) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 20): MongoError: no connection available
MongoDB reconnected
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:57.189Z
        success 2018-01-04T21:57:16.949Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:58.193Z
        success 2018-01-05T21:49:44.993Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T21:59:59.198Z
        success 2018-01-05T21:48:35.745Z
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    reading @ 2018-01-05T22:00:00.200Z
        success 2018-01-05T21:51:41.403Z
```
