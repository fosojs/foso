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

function notify() {
  updateNotifier({
    pkg: pkg
  }).notify({
    defer: false
  });
}

program
  .version(pkg.version);

program
  .command('serve [plugins...]')
  .usage('[options]')
  .description('Starts a foso server in current directory')
  .option('-m, --minify', 'Minify the resources')
  .option('-e, --env <env>', 'set the environment for which to bundle ' +
    'the scripts')
  .action(function(plugins, opts) {
    notify();

    var cert = {
      key: fs.readFileSync(__dirname + '/certs/privatekey.pem'),
      cert: fs.readFileSync(__dirname + '/certs/certificate.pem')
    };
    bundle(plugins, {
      watch: true,
      minify: !!opts.minify,
      env: opts.env,
      serve: {
        port: '1769',
        securePort: '1770',
        cert: cert
      },
      livereload: cert
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
  .usage('[options]')
  .description('Bundles foso scripts')
  .option('-m, --minify', 'Minify the resources')
  .option('-e, --env <env>', 'set the environment for which to bundle the ' +
    'scripts')
  .option('-h, --host <host>', 'the host on which the scripts are served. ' +
    'E.g. -h example.com.')
  .option('-s, --secure-host <hostSecure>', 'the secure host on which the ' +
    'scripts are served. E.g. -s secure.example.com. Only has to be ' +
    'specified if the secure host is not the same as the non-secure one.')
  .action(function(plugins, opts) {
    notify();

    bundle(plugins, {
      minify: !!opts.minify,
      watch: false,
      env: opts.env,
      host: opts.host,
      secureHost: opts.secureHost
    });
  });

  program
    .command('watch [plugins...]')
    .usage('[options]')
    .description('Bundles foso scripts and rebundles them on change.')
    .option('-m, --minify', 'Minify the resources')
    .option('-e, --env <env>', 'set the environment for which to bundle the ' +
      'scripts')
    .option('-h, --host <host>', 'the host on which the scripts are served. ' +
      'E.g. -h example.com.')
    .option('-s, --secure-host <hostSecure>', 'the secure host on which the ' +
      'scripts are served. E.g. -s secure.example.com. Only has to be ' +
      'specified if the secure host is not the same as the non-secure one.')
    .action(function(plugins, opts) {
      notify();

      bundle(plugins, {
        minify: !!opts.minify,
        watch: true,
        env: opts.env,
        host: opts.host,
        secureHost: opts.secureHost,
        livereload: true
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
