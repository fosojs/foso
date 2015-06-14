#!/usr/bin/env node
'use strict';

var program = require('commander');
var pkg = require('../package');
var path = require('path');
var serve = require('./server');
var bundle = require('./bundle');
var updateNotifier = require('update-notifier');

program
  .version(pkg.version);

program
  .command('serve')
  .usage('[options]')
  .description('Starts a Foso server in current directory')
  .option('-m, --minify', 'Minify the resources')
  .option('-e, --env <env>', 'set the environment for which to bundle the scripts')
  .action(function(opts) {
    notify();
    var currentPath = path.resolve(process.cwd());

    serve(currentPath, {
      buildFolder: getBuildFolder(currentPath),
      minify: !!opts.minify,
      env: opts.env
    });
  });

program
  .command('build')
  .usage('[options]')
  .description('Bundles Foso scripts')
  .option('-m, --minify', 'Minify the resources')
  .option('-e, --env <env>', 'set the environment for which to bundle the scripts')
  .option('-h, --host <host>', 'the host on which the scripts are served. E.g. -h example.com. ' +
          'Note: only use when the secure and non-secure hostname are the same. ' +
          'Otherwise use origin and secure-origin to pass the different addresses.')
  .option('-s, --secure-host <hostSecure>', 'the secure host on which the scripts are served. E.g. -s secure.example.com. ' +
          'Only has to be specified if the secure host is not the same as the non-secure one.')
  .action(function(opts) {
    notify();
    var currentPath = path.resolve(process.cwd());

    bundle({
      source: currentPath,
      dest: getBuildFolder(currentPath),
      minify: !!opts.minify,
      watch: false,
      env: opts.env,
      host: opts.host,
      secureHost: opts.secureHost
    });
  });

function notify() {
  updateNotifier({
    pkg: pkg
  }).notify({
    defer: false
  });
}

function getBuildFolder(currentPath) {
  return path.join(currentPath, './_build');
}

program.parse(process.argv);
