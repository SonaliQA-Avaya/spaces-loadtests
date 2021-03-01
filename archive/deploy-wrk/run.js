const exec = require('exec-sh');
const async = require('async');
const fs = require('fs');

var dashDash = process.argv.indexOf('--');
var args = dashDash > -1 ? process.argv.slice(dashDash + 1).join(' ') : [];

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
    errLogs = [],
    timestamps = {};

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

  // prepare kubectl exec commands
  pods.forEach(function(pod, idx) {
    const out = fs.openSync(outLogs[idx], 'w');
    const err = fs.openSync(errLogs[idx], 'w');

    promises.push(async.apply(exec, `kubectl exec ${pod} -- wrk ${args}`, {
      stdio: ['ignore', out, err]
    }));
  });

  timestamps.startAt = new Date();

  async.parallel(promises, function(error, results) {
    timestamps.endAt = new Date();

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

      var total = {
          requests: 0,
          duration: 0,
          count: 0,
          latency: {
            50: 0,
            75: 0,
            90: 0,
            99: 0
          },
          errors: {
            socket: {
              connect: 0,
              read: 0,
              write: 0,
              timeout: 0,
              total: 0,
            },
            http: 0,
            total: 0
          },
        },
        latencyLines = false;

      results.forEach(function(one, idx) {
        console.log(`>>>>>>> result of pod ${pods[idx]}`)
        console.log(one);

        var lines = one.split(/\n/);
        lines.forEach(function(line) {
          // 10914 requests in 15.10s, 1.80MB read
          var m = line.match(/([0-9]+) requests in ([0-9\.\,]+)s, ([0-9\.KMGB]+) read/);
          if (m) {
            total.requests += parseInt(m[1], 10);
            total.duration += parseFloat(m[2]);
            total.count++;
            return;
          }

          m = line.match(/([0-9]+) requests in ([0-9\.\,]+)m, ([0-9\.KMGB]+) read/);
          if (m) {
            total.requests += parseInt(m[1], 10);
            total.duration += parseFloat(m[2]) * 60;
            total.count++;
            return;
          }

          m = line.match(/Socket errors: connect ([0-9]+), read ([0-9]+), write ([0-9]+), timeout ([0-9]+)/);
          if (m) {
            total.errors.socket.connect += parseInt(m[1], 10);
            total.errors.socket.read += parseInt(m[2], 10);
            total.errors.socket.write += parseInt(m[3], 10);
            total.errors.socket.timeout += parseInt(m[4], 10);
            return;
          }

          m = line.match(/Non-2xx or 3xx responses: ([0-9]+)/);
          if (m) {
            total.errors.http += parseInt(m[1], 10);
            return;
          }

          m = line.match(/Latency Distribution/);
          if (m) {
            latencyLines = true;
          }
          if (latencyLines) {
            m = line.match(/([0-9]+)%\s+([0-9\.]+)ms/);
            if (m) {
              if (!total.latency[m[1]]) {
                total.latency[m[1]] = 0;
              }
              total.latency[m[1]] += parseFloat(m[2]);
              return;
            }

            m = line.match(/([0-9]+)%\s+([0-9\.]+)s/);
            if (m) {
              if (!total.latency[m[1]]) {
                total.latency[m[1]] = 0;
              }
              total.latency[m[1]] += parseFloat(m[2]) * 1000;
              return;
            }
          }
        });
      });

      total.avgDuration = total.count > 0 ? total.duration / total.count : 0;
      total.rps = total.avgDuration ? total.requests / total.avgDuration : 0;
      total.avgLatency = {};
      Object.keys(total.latency).forEach(function(key) {
        total.avgLatency[key] = total.count > 0 ? total.latency[key] / total.count : 0;
      });
      total.errors.socket.total = total.errors.socket.connect + total.errors.socket.read + total.errors.socket.write + total.errors.socket.timeout;
      total.errors.total = total.errors.socket.total + total.errors.http;
      total.errors.socket.rate = total.requests ? (total.errors.socket.total * 100) / total.requests : 0;
      total.errors.rate = total.requests ? (total.errors.total * 100) / total.requests : 0;

      console.log(`>>>>>>> aggregated result of all pods`);
      console.log(`Total requests  : ${total.requests}`);
      console.log(`Duration        : ${total.avgDuration}`);
      console.log(`Average RPS     : ${total.rps}`);
      console.log(`Average Latency :`);
      Object.keys(total.avgLatency).forEach(function(key) {
        console.log(`  ${key}%: ${total.avgLatency[key]}ms`);
      });
      console.log(`Socket Error    : ${total.errors.socket.rate}%`);
      console.log(`Total Error     : ${total.errors.rate}%`);
      console.log(`Test Start At   : ${timestamps.startAt}`);
      console.log(`Test End   At   : ${timestamps.endAt}`);
      console.log('Raw Result      :', JSON.stringify(total));
    });
  });
});
