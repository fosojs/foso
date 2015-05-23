#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkg = require('./package');
var path = require('path');
var serve = require('./lib/server');
var bundle = require('./lib/bundle');

program
  .version(pkg.version);

program
  .command('serve')
  .usage('[options]')
  .description('Starts a Foso server in current directory')
  .action(function() {
    var currentPath = path.resolve(process.cwd());

    serve(currentPath, {
      buildFolder: getBuildFolder(currentPath)
    });
  });

program
  .command('build')
  .usage('[options]')
  .description('Bundles Foso scripts')
  .action(function() {
    var currentPath = path.resolve(process.cwd());

    bundle(currentPath, {
      buildFolder: getBuildFolder(currentPath)
    });
  });

function getBuildFolder(currentPath) {
  return path.join(currentPath, './_build');
}

program.parse(process.argv);
