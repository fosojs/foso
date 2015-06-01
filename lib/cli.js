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
  .option('-o, --origin <origin>', 'the non-secure hoster of the scripts. E.g. -o http://example.com. ' +
          'If skipped, the secure one will be used. If the hostname is the same for secure and non-secure endpoints, --host can be used instead.')
  .option('-s, --secure-origin <secureOrigin>', 'the secure domain of the scripts. E.g. -s https://secure.example.com. ' +
         'If the hostname is the same for secure and non-secure endpoints, --host can be used instead.')
  .action(function(opts) {
    notify();
    var currentPath = path.resolve(process.cwd());
  
    var bundleOpts = {
      buildFolder: getBuildFolder(currentPath),
      minify: !!opts.minify,
      watch: false,
      env: opts.env
    };
    
    if (opts.host) {
      bundleOpts.origin = 'http://' + opts.host;
      bundleOpts.secureOrigin = 'https://' + opts.host;
    } else {
      bundleOpts.origin = opts.origin;
      bundleOpts.secureOrigin = opts.secureOrigin;
    }

    bundle(currentPath, bundleOpts);
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
