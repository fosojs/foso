'use strict';

var connect = require('connect');
var http = require('http');
var https = require('https');
var fs = require('fs');
var watch = require('glob-watcher');
var _ = require('lodash');
var livereload = require('gulp-livereload');
var serveStatic = require('serve-static');
var bundle = require('./bundle');
var path = require('path');

function serve(basePath) {
  bundle(basePath);
  
  var trojanPort = '1769';
  
  var app = connect();
  app.use(serveStatic(path.join(basePath, 'dist')));
  http.createServer(app).listen(trojanPort, 'localhost');
  
  //TODO: Change these for your own certificates.  This was generated
  //through the commands:
  //openssl genrsa -out privatekey.pem 1024
  //openssl req -new -key privatekey.pem -out certrequest.csr
  //openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
  var options = {
    key: fs.readFileSync(__dirname + '/certs/privatekey.pem'),
    cert: fs.readFileSync(__dirname + '/certs/certificate.pem')
  };
  
  // Create our HTTPS server listening on port config.get('port').
  https.createServer(options, app).listen('1770');
  
  // Start livereload
  livereload(_.extend(options, {
    port: '2769'
  }));
  livereload.listen();
  var watcher = watch(path.join(basePath, 'dist', '*.js'));
  watcher.on('change', function (file) {
    livereload.changed(file.path);
  });
  
  console.log('----------------------');
  console.log('Trojan server started on http://localhost:1769 and https://localhost:1770');
  console.log('');
  console.log('Press Ctrl+C to stop it');
  console.log('----------------------');
}

module.exports = serve;