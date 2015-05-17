'use strict';

var connect = require('connect');
var http = require('http');
var https = require('https');
var fs = require('fs');
var watch = require('glob-watcher');
var _ = require('lodash');
var LiveReload = require('tiny-lr').Server;
var serveStatic = require('serve-static');
var bundle = require('./bundle');
var path = require('path');
var chalk = require('chalk');

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
  var livereload = new LiveReload(_.extend(options, {
    port: '2769'
  }));
  livereload.listen('2769', '0.0.0.0');
  var watcher = watch(path.join(basePath, 'dist', '*.js'));
  watcher.on('change', function (file) {
    livereload.changed({
      body: {
        files: [file.path]
      }
    });
  });

  var logoColor = chalk.cyan;
  console.log('------------------------');
  console.log(logoColor('8888 888888 88888 888888'));
  console.log(logoColor('88   88  88 88    88  88'));
  console.log(logoColor('8888 88  88 88888 88  88'));
  console.log(logoColor('88   88  88    88 88  88'));
  console.log(logoColor('88   888888 88888 888888'));
  console.log('------------------------');
  console.log('Foso server started on ' +
    chalk.gray('http://localhost:1769') + ' and ' +
    chalk.gray('https://localhost:1770'));
  console.log('');
  console.log('Press ' + chalk.gray('Ctrl+C') + ' to stop it');
  console.log('------------------------');
}

module.exports = serve;