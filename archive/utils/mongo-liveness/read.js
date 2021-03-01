// ================================================
const mongoose = require('mongoose');
const config = require('./config.json');

// ================================================

mongoose.Promise = Promise;

// temporarily enable debugging in order to get statistics of read/write
// tjia - Oct 6, 2017
// mongoose.set('debug', true);

mongoose.connect(config.mongo.uri, config.mongo.options);

mongoose.connection.on('connected', function() {
  console.log('MongoDB connected');
  process.env['mongoUA'] = 'connected';
});
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  mongoose.disconnect();
});
mongoose.connection.on('disconnected', function() {
  console.warn('MongoDB disconnected! Reconnecting in 3 seconds');
  process.env['mongoUA'] = 'disconnected';
  setTimeout(function() {
    mongoose.connect(config.mongo.uri, config.mongo.options);
  }, 3000);
});
mongoose.connection.on('reconnected', function() {
  console.log('MongoDB reconnected');
  process.env['mongoUA'] = 'connected';
});

if (config.env === 'logan-production') {
  if (mongoose.connection.db.serverConfig.s.replset) {
    var haLogCount = 0;
    mongoose.connection.db.serverConfig.s.replset.on('ha', function(type, data) {
      if (haLogCount == 0) {
        console.log('MongodDB replset ha ' + type);
      }
      haLogCount += 1;
      if (haLogCount >= 360) {
        haLogCount = 0;
      }
    });
    mongoose.connection.db.serverConfig.s.replset.on('timeout', function() {
      console.error('MongoDB timeout');
    });
  }
}

// ================================================
const ConnectionTestModel = require('./connection-test');
const read = function(cb) {
  let d = (new Date()).toISOString();
  console.log('    reading @ ' + d);
  ConnectionTestModel.aggregate({ $sample: { size: 1 } }, function(err, result) {
    if (err) {
      console.error('!!!!! READ ERROR !!!!', err && err.message);
      return;
    }

    console.log('        success', result && result[0] && result[0].rnd);
  });
}

// ================================================
setInterval(function() {
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  read();
}, 1000);
