#!/usr/bin/env node

'use strict';

var cli = require('cli').enable('status'),
  ln = require("ln"),
  _ = require('lodash'),
  q = require('q'),
  moment = require('moment'),
  yaml = require('js-yaml'),
  fs = require('fs'),
  path = require('path'),
  util = require('util');

var options = cli.parse({
  file: ['f', 'file name', 'string'],
  verbose: ['v', 'Show detail information', 'boolean', false],
});

var appenders = [{
    type: 'console'
  }],
  logger = new ln({
    name: 'analysis.log',
    appenders: appenders,
    formatter: function(json) { //It customizes the log format.
      return util.format('[%s] [#%d] [%s] [%s] - %s', moment(json.t).format(), json.p, ln.LEVEL[json.l], json.n, json.m);
    },
  }),
  meta = {
    slowRequestThreshold: 20
  };

if (options.verbose) {
  logger.setLevel('DEBUG');
}

logger.info('>>> Analysis log...');
logger.debug(util.format('    Options: %j', options));

q()
  .then(function() {
    if (!options.file) {
      throw new Error('File name is required.');
    }

    return q.ninvoke(fs, 'readFile', options.file, {
      encoding: 'utf-8'
    });
  })
  .then(function(content) {
    var lines = content.split('\n');
    meta.total = 0;
    meta.errors = 0;
    meta.minutes = {};
    meta.methods = {};
    meta.URIs = {};
    meta.httpStatuses = {};
    meta.slowRequests = [];
    _.forEach(lines, function(line, lineno) {
      if (!line) return;

      var data = JSON.parse(line);
      if (!data || !data.timestamp || !data.message);

      data.timestamp = moment(data.timestamp);

      // { timestamp: '2017-10-05T04:00:17.163Z',
      // level: 'info',
      // message: '2017-10-05T04:00:17.162Z - info: MorganRequest=edd602e4-69b8-42d8-ac5c-75186c332cf0 127.0.0.1 - - [Thu, 05 Oct 2017 04:00:17 GMT] Method=GET URL=/assets/js/zang-sw-config.js?tms=1507175976752  Status=200 0.193 ms 55 [Referer=https://spaces.zang.io/assets/js/zang-spaces-sw.js UserAgent=Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36]\n' }
      //
      // MorganRequest=:id :remote-addr - :remote-user [:date] Method=:method URL=:url Status=:status :response-time ms :res[content-length] [Referer=:referrer UserAgent=:user-agent]

      var details = data.message.match(/MorganRequest=(\S+)\s+(\S+)\s+-\s+(\S+)\s+\[([^\[\]]+)\]\s+Method=(\S+)\s+URL=(\S+)\s+Status=(.+)\s+(\S+)\s+ms\s+(\S+)\s+\[Referer=([^\[\]]+)\s+UserAgent=([^\[\]]+)\]/);

      if (details) {
        meta.total++;

        data.reqId = details[1];
        data.remoteAddr = details[2];
        data.remoteUser = details[3];
        data.date = details[4];
        data.method = details[5];
        data.uri = details[6];
        data.status = details[7];
        data.responseTime = parseFloat(details[8]);
        data.contentLength = parseFloat(details[9]);
        data.referer = details[10];
        data.userAgent = details[11];
        // console.log(data);

        var h = data.timestamp.hour(),
          m = data.timestamp.minute(),
          hm = '';

        if (h < 10) {
          hm = '0' + h;
        } else {
          hm = '' + h;
        }
        if (m < 15) {
          hm += '00';
        } else if (m < 30) {
          hm += '15';
        } else if (m < 45) {
          hm += '30';
        } else {
          hm += '45';
        }

        if (!meta.minutes[hm]) {
          meta.minutes[hm] = 0;
        }
        meta.minutes[hm]++;

        if (!meta.methods[data.method]) {
          meta.methods[data.method] = 0;
        }
        meta.methods[data.method]++;

        var uriExplained = data.uri, uriKey;
        if (data.uri.match(/^\/assets\/js\/zang-sw-config\.js\?tms=[0-9]+$/)) {
          uriExplained = '/assets/js/zang-sw-config.js?tms=:tms';

        } else if (data.uri.match(/^\/api\/files\/viewUrls\/.+/)) {
          uriExplained = '/api/files/viewUrls/:id';

        } else if (data.uri.match(/^\/api\/ideas\/[0-9a-z]{24}\/messages/)) {
          uriExplained = '/api/ideas/:id/messages';

        } else if (data.uri.match(/^\/api\/messages\/[0-9a-z]{24}\/files\/.+\/viewerUrl/)) {
          uriExplained = '/api/messages/:id/files/:id/viewerUrl';
        } else if (data.uri.match(/^\/api\/messages\/[0-9a-z]{24}/)) {
          uriExplained = '/api/messages/:id';

        } else if (data.uri.match(/^\/api\/topics\/[0-9a-z]{24}\/ideas/)) {
          uriExplained = '/api/topics/:topicid/ideas';
        } else if (data.uri.match(/^\/api\/topics\/[0-9a-z]{24}\/join/)) {
          uriExplained = '/api/topics/:topicid/join';
        } else if (data.uri.match(/^\/api\/topics\/[0-9a-z]{24}\/members/)) {
          uriExplained = '/api/topics/:topicid/members';
        } else if (data.uri.match(/^\/api\/topics\/invites\/[0-9a-z]{24}\/join/)) {
          uriExplained = '/api/topics/invites/:id/join';
        } else if (data.uri.match(/^\/api\/topics\/[0-9a-z]{24}\/invite/)) {
          uriExplained = '/api/topics/:topicid/invite';
        } else if (data.uri.match(/^\/api\/topics\/[0-9a-z]{24}\/tasks/)) {
          uriExplained = '/api/topics/:topicid/tasks';
        } else if (data.uri.match(/^\/api\/topics\/direct\/user\/[0-9a-z]{24}/)) {
          uriExplained = '/api/topics/direct/user/:id';
        } else if (data.uri.match(/^\/api\/topics\/[0-9a-z]{24}\/messages\/byref/)) {
          uriExplained = '/api/topics/:topicid/messages/byref';
        } else if (data.uri.match(/^\/api\/topics\/[0-9a-z]{24}\/messages\/query/)) {
          uriExplained = '/api/topics/:topicid/messages/query';
        } else if (data.uri.match(/^\/api\/topics\/[0-9a-z]{24}/)) {
          uriExplained = '/api/topics/:topicid';

        } else if (data.uri.match(/^\/api\/spaces\/[0-9a-z]{24}\/messages\/byref/)) {
          uriExplained = '/api/spaces/:topicid/messages/byref';
        } else if (data.uri.match(/^\/api\/spaces\/[0-9a-z]{24}\/members/)) {
          uriExplained = '/api/spaces/:topicid/members';

        } else if (data.uri.match(/^\/api\/users\/me\/colleagues\/\?search=.+$/)) {
          uriExplained = '/api/users/me/colleagues/?search=:search';
        } else if (data.uri.match(/^\/api\/users\/me\/settings\/[0-9a-z]{24}$/)) {
          uriExplained = '/api/users/me/settings/:id';
        } else if (data.uri.match(/^\/api\/users\/me\/topics\/[0-9a-z]{24}\/preference$/)) {
          uriExplained = '/api/users/me/topics/:id/preference';
        } else if (data.uri.match(/^\/api\/users\/me\/spaces/)) {
          uriExplained = '/api/users/me/spaces';

        } else if (data.uri.match(/^\/login\?.+/)) {
          uriExplained = '/login';

        } else if (data.uri.match(/^\/spaces\/pictures\/.+/)) {
          uriExplained = '/spaces/pictures/:id';
        } else if (data.uri.match(/^\/spaces\/invites\/[0-9a-z]{24}\/join/)) {
          uriExplained = '/spaces/invites/:id/join';
        } else if (data.uri.match(/^\/spaces\/[0-9a-z]{24}/)) {
          uriExplained = '/spaces/:topicid';

        } else if (data.uri.match(/^\/vendors\/.+/)) {
          uriExplained = '/vendors/---';
        }

        uriKey = data.method + ' ' + uriExplained;
        if (!meta.URIs[uriKey]) {
          meta.URIs[uriKey] = {
            count: 0,
            method: data.method,
            uri: uriExplained,
          };
        }
        meta.URIs[uriKey].count++;

        if (!meta.httpStatuses[data.status]) {
          meta.httpStatuses[data.status] = 0;
        }
        meta.httpStatuses[data.status]++;

        if (data.responseTime > meta.slowRequestThreshold) {
          meta.slowRequests.push(data);
        }
      } else {
        meta.errors++;
        logger.warn('Line #' + (lineno + 1) + ' parse error, not matching morgan log: ' + line);
      }
    });
  })
  .then(function() {
    console.log('Total: ' + meta.total);
    console.log('Errors: ' + meta.errors);
    console.log('By Minute', _.sortBy(_.toPairs(meta.minutes), function(one) {
      return one[0];
    }));
    console.log('By URI >>>');
    console.log(yaml.safeDump(_.values(_.fromPairs(_.sortBy(_.filter(_.toPairs(meta.URIs), function(one) {
      return one[1].count > 10;
    }), function(one) {
      return one[1].count;
    })))));
    console.log('By HTTP Methods', meta.methods);
    console.log('By HTTP Status', meta.httpStatuses);
    console.log('Slowest 20 Requests', _.takeRight(_.sortBy(meta.slowRequests, function(one) {
      return one.responseTime;
    }), 20));
  })
  .catch(function(error) {
    logger.error(error && _.isFunction(error.toString) ? error.toString() : error);
    if (error && error.stack) {
      logger.debug(error.stack);
    }
  })
  .done(function() {
    logger.info('<<< DONE');
  });
