const http = require('http');
http.globalAgent.maxSockets = Infinity;

const express = require('express');
const app = express();
const port = process.env.PORT || 6666;

app.get('/', function(req, res) {
  res.send('ok')
})

app.listen(port, function() {
  console.log('Example app listening on port ' + port + '!');
})
