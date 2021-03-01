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

  // prepare kubectl exec commands
  pods.forEach(function(pod, idx) {
    const out = fs.openSync(outLogs[idx], 'w');
    const err = fs.openSync(errLogs[idx], 'w');

    promises.push(async.apply(exec, `kubectl exec ${pod} -- ${args}`, {
      stdio: ['ignore', out, err]
    }));
  });

  async.parallel(promises, function(error, results) {
    console.log(results);
  });
});
