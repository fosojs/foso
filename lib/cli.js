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
  .action(function(options) {
    notify();
    var currentPath = path.resolve(process.cwd());

    serve(currentPath, {
      buildFolder: getBuildFolder(currentPath),
      minify: !!options.minify
    });
  });

program
  .command('build')
  .usage('[options]')
  .description('Bundles Foso scripts')
  .option('-m, --minify', 'Minify the resources')
  .action(function(options) {
    notify();
    var currentPath = path.resolve(process.cwd());

    bundle(currentPath, {
      buildFolder: getBuildFolder(currentPath),
      minify: !!options.minify,
      watch: false
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
