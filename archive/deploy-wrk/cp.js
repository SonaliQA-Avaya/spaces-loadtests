const exec = require('exec-sh');
const async = require('async');
const fs = require('fs');

// copy files to all pods

if (process.argv.length !== 4) {
  console.error(`Usage: node cp.js <local_file> <remote_location>`);
  process.exit(1);
}

var cp = {
  from: process.argv[2],
  to: process.argv[3],
};

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

    promises.push(async.apply(exec, `kubectl cp ${cp.from} ${pod}:${cp.to}`, {
      stdio: ['ignore', out, err]
    }));
  });

  async.parallel(promises, function(error, results) {
    console.log(results);
  });
});
