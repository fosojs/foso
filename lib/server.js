'use strict';

var connect = require('connect');
var http = require('http');
var https = require('https');
var serveStatic = require('serve-static');

function serveSecure(app, opts) {
  if (!opts.cert) {
    throw new Error('opts.cert is required');
  }

  https.createServer(opts.cert, app).listen(opts.securePort);
}

function serve(target, opts) {
  opts = opts || {};

  if (!target) {
    throw new Error('target is required');
  }
  if (!opts.port) {
    throw new Error('opts.port is required');
  }

  var app = connect();
  app.use(serveStatic(target));
  http.createServer(app).listen(opts.port, 'localhost');

  if (opts.securePort) {
    serveSecure(app, opts);
  }
}

module.exports = serve;
