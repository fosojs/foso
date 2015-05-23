#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkg = require('./package');
var path = require('path');
var serve = require('./lib/server');

program
  .version(pkg.version);

program
  .command('serve')
  .usage('starts a Foso server in current directory')
  .description('Starts a Foso server in current directory')
  .action(function() {
    var currentPath = path.resolve(process.cwd());
    serve(currentPath);
  });

program.parse(process.argv);
