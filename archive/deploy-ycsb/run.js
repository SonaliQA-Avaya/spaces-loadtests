const exec = require('exec-sh');
const async = require('async');
const fs = require('fs');

var dashDash = process.argv.indexOf('--');
var args = dashDash > -1 ? process.argv.slice(dashDash + 1).join(' ') : '';

// list pods
exec('kubectl get pods -o=name', { stdio: 'pipe' }, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`exec stderr: ${stderr}`);
    return;
  }

  var promises = [],
    pods = [],
    outLogs = [],
    errLogs = [];

  stdout.split(/\n/).forEach(function(pod) {
    if (!pod) return;
    if (pod.substr(0, 5) !== 'pods/') return;
    pod = pod.substr(5);
    pods.push(pod);
    outLogs.push(`./out-${pod}.log`);
    errLogs.push(`./err-${pod}.log`);
  });

  if (pods.length === 0) {
    console.warn('No pod found');
    return;
  }
  console.log(`${pods.length} pods found:`, pods);

  const isLoad = args.match(/^load\s+/i);
  var m = args.match(/-p\s+recordcount=([0-9]+)\s+/i),
    recordsPerPod = 0;
  if (isLoad && m) {
    recordsPerPod = Math.floor(parseInt(m[1], 10) / pods.length);
  }

  // prepare kubectl exec commands
  pods.forEach(function(pod, idx) {
    const out = fs.openSync(outLogs[idx], 'w');
    const err = fs.openSync(errLogs[idx], 'w');

    var batch = '',
      startAt;
    if (isLoad && recordsPerPod) {
      startAt = recordsPerPod * idx;
      batch = ` -p insertstart=${startAt} -p insertcount=${recordsPerPod}`;
    }

    promises.push(async.apply(exec, `kubectl exec ${pod} -- ./bin/ycsb ${args}${batch}`, {
      stdio: ['ignore', out, err]
    }));
  });

  async.parallel(promises, function(error, results) {
    // read execution result log
    var promises = [];
    outLogs.forEach(function(log) {
      promises.push(async.apply(fs.readFile, log, 'utf8'));
    });

    async.parallel(promises, function(error, results) {
      if (error) {
        console.error(`exec error: [${error}]`);
        return;
      }

      var total = { requests: 0, duration: 0, ops: 0, count: 0 };

      results.forEach(function(one, idx) {
        console.log(`>>>>>>> result of pod ${pods[idx]}`)
        console.log(one);

        var lines = one.split(/\n/),
          duration, ops, requests;
        lines.forEach(function(line) {
          // [OVERALL], RunTime(ms), 426187.0
          // [OVERALL], Throughput(ops/sec), 23463.878532193616
          var m = line.match(/\[OVERALL\], RunTime\(ms\), ([0-9\.]+)/);
          if (m) {
            duration = parseFloat(m[1]);
          } else {
            m = line.match(/\[OVERALL\], Throughput\(ops\/sec\), ([0-9\.]+)/);
            if (m) {
              ops = parseFloat(m[1]);
            }
          }
        });

        if (duration && ops) {
          total.duration += duration;
          total.ops += ops;
          requests = (duration * ops) / 1000;
          total.requests += requests;
          total.count++;
        }
      });

      total.avgDuration = total.count > 0 ? (total.duration / (total.count * 1000)) : 0;
      total.avgOps = total.count > 0 ? (total.ops / total.count) : 0;
      total.rps = total.avgDuration ? total.requests / total.avgDuration : 0;

      console.log(`>>>>>>> aggregated result of all pods`);
      console.log(`Total operations      : ${total.requests}`);
      console.log(`Average duration      : ${total.avgDuration}s`);
      console.log(`Average ops (reverse) : ${total.rps}`);
      console.log(`Average ops per pod   : ${total.avgOps}`);
      console.log(`Total ops             : ${total.ops} <== check this`);
    });
  });
});
