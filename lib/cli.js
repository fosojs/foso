#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('../package');
var path = require('path');
var serve = require('./server');
var bundle = require('./bundle');
var updateNotifier = require('update-notifier');
var chalk = require('chalk');
var fs = require('fs');
var Configstore = require('configstore');

updateNotifier({
  pkg: pkg
}).notify({
  defer: false
});

program
  .version(pkg.version);

program
  .command('serve [plugins...]')
  .alias('server')
  .usage('[options]')
  .description('Starts a foso server in current directory')
  .option('-m, --minify', 'Minify the resources')
  .action(function(plugins, opts) {
    var cert = {
      key: fs.readFileSync(__dirname + '/certs/privatekey.pem'),
      cert: fs.readFileSync(__dirname + '/certs/certificate.pem')
    };
    bundle(plugins, {
      preset: 'develop',
      minify: opts.minify,
      serve: {
        port: '1769',
        securePort: '1770',
        cert: cert
      },
      livereload: cert,
    }, function(err) {
      if (err) {
        console.log('An error happened during serving.');
        console.error(err);
      }
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
  });

program
  .command('build [plugins...]')
  .alias('bundle')
  .usage('[options]')
  .description('Bundles foso scripts')
  .option('-m, --minify', 'Minify the resources')
  .option('-h, --host <host>', 'the host on which the scripts are served. ' +
    'E.g. -h example.com.')
  .option('-s, --secure-host <hostSecure>', 'the secure host on which the ' +
    'scripts are served. E.g. -s secure.example.com. Only has to be ' +
    'specified if the secure host is not the same as the non-secure one.')
  .option('-b, --base-url <baseURL>', 'The base URL of the resources. ' +
    'Shouldn\'t contain the host.')
  .action(function(plugins, opts) {
    bundle(plugins, {
      preset: 'build',
      minify: opts.minify,
      host: opts.host,
      secureHost: opts.secureHost,
      baseURL: opts.baseUrl,
    }, function(err) {
      if (err) {
        console.log('An error happened during bundling.');
        console.error(err);
      }
    });
  });

program
  .command('watch [plugins...]')
  .usage('[options]')
  .description('Bundles foso scripts and rebundles them on change.')
  .option('-m, --minify', 'Minify the resources')
  .option('-h, --host <host>', 'the host on which the scripts are served. ' +
    'E.g. -h example.com.')
  .option('-s, --secure-host <hostSecure>', 'the secure host on which the ' +
    'scripts are served. E.g. -s secure.example.com. Only has to be ' +
    'specified if the secure host is not the same as the non-secure one.')
  .option('-b, --base-url <baseURL>', 'The base URL of the resources. ' +
    'Shouldn\'t contain the host.')
  .action(function(plugins, opts) {
    bundle(plugins, {
      preset: 'develop',
      minify: opts.minify,
      host: opts.host,
      secureHost: opts.secureHost,
      baseURL: opts.baseUrl,
    }, function(err) {
      if (err) {
        console.log('An error happened during watching.');
        console.error(err);
      }
    });
  });

program
  .command('plugins')
  .description('Outputs the list of registered plugins.')
  .action(function() {
    var conf = new Configstore('foso', { plugins: [] });
    var plugins = conf.get('plugins');

    plugins.forEach(function(plugin) {
      console.log(plugin.name);
    });
  });

program.parse(process.argv);
