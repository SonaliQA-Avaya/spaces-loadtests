const exec = require('exec-sh');
const async = require('async');
const fs = require('fs');

var dashDash = process.argv.indexOf('--');
var args = dashDash > -1 ? process.argv.slice(dashDash + 1).join(' ') : [];
var pods = [];

function exitHandler(options, err) {
  console.log("\n", 'exiting from', options.from);
  if (options.cleanup) {
    console.log('>>>>>>> cleaning artillery processes...');
    var promises = [];
    pods.forEach(function(pod, idx) {
      promises.push(async.apply(exec, `kubectl exec ${pod} -- pkill -f artillery`));
    });
    async.parallel(promises, function(error, results) {
      console.log('    - ', results);
    });
    console.log('done.');
  }
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}
//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true, from: 'exit' }));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { cleanup: true, exit: true, from: 'SIGINT' }));
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { cleanup: true, exit: true, from: 'SIGUSR1' }));
process.on('SIGUSR2', exitHandler.bind(null, { cleanup: true, exit: true, from: 'SIGUSR2' }));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { cleanup: true, exit: true, from: 'uncaughtException' }));


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
    outLogs = [],
    errLogs = [],
    timestamps = {};

  stdout.split(/\n/).forEach(function(pod) {
    if (!pod) return;
    const pod_prefix = 'pod/'
    if (pod.substr(0, pod_prefix.length) !== pod_prefix) return;
    pod = pod.substr(pod_prefix.length);
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

    promises.push(async.apply(exec, `kubectl exec ${pod} -- artillery run ${args}`, {
      stdio: ['ignore', out, err]
    }));
  });

  var cleanupArtilleryLog = (lines) => {
    var alines = lines.split(/\n/),
      lastLine, reportStarted = false,
      reportAdded = false,
      lastReport = [],
      transformed = [];

    alines.forEach(function(line) {
      if (line.match(/^Report @ /)) {
        reportStarted = true;
        lastReport = [];
        lastReport.push(line);
      } else if (line.trim() === '') {
        if (reportStarted) {
          reportStarted = false;
          lastReport.push(line);
        } else {
          transformed.push(line);
        }
      } else if (line.match(/^All virtual users finished/)) {
        transformed = transformed.concat(lastReport);
        reportAdded = true;
        transformed.push(line);
      } else if (reportStarted) {
        lastReport.push(line);
      } else {
        transformed.push(line);
      }
    });

    if (!reportAdded && lastReport.length > 0) {
      transformed = transformed.concat(lastReport);
    }

    return transformed.join("\n");
  };

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

      results.forEach(function(one, idx) {
        console.log(`>>>>>>> result of pod ${pods[idx]}`)
        console.log(cleanupArtilleryLog(one));
      });
    });
  });
});
