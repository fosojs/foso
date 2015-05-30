'use strict';

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var vfs = require('vinyl-fs');
var uglify = require('gulp-uglify');
var _ = require('lodash');
var glob = require('glob');
var watchify = require('watchify');
var browserify = require('browserify');
var lessify = require('node-lessify');
var stringify = require('stringify');
var chalk = require('chalk');
var jadeify = require('jadeify');
var babelify = require('babelify');
var path = require('path');
var gulpif = require('gulp-if');
var normalize = require('normalize-path');

var es6Extensions = ['.babel', '.es6'];

function bundle(bundleName, bundler, options) {
  options = options || {};

  if (!options.buildFolder) {
    throw new Error('options.buildFolder is required');
  }

  return bundler
    .bundle()
    .on('error', function(err) {
      console.log('Error during bundling');
      console.error(err);
    })
    .pipe(source(bundleName))
    .pipe(buffer())
    .pipe(gulpif(options.minify, uglify()))
    .pipe(vfs.dest(options.buildFolder));
}

function build(basePath, options) {
  options = options || {};
  basePath = normalize(basePath);

  if (!options.buildFolder) {
    throw new Error('options.buildFolder is required');
  }

  var rootIndexRegex = RegExp(basePath + '/index\.(js|es6|babel)');
  function getBundleName(filePath) {
    if (rootIndexRegex.test(filePath)) {
      return 'index.js'
    }
    var parts = filePath.split('/');
    var targetPath = parts.splice(0, parts.length - 1).join('/') + '.js';
    return targetPath.replace(basePath + '/', '');
  }

  glob(basePath + '/**/index.{js,es6,babel}', { ignore: '**/_**/**' }, function(err, files) {
    files.forEach(function(file) {
      var bundleName = getBundleName(file);

      var opts = _.extend(options.watch ? watchify.args : {}, {
        entries: [file],
        extensions: ['.js', '.json'].concat(es6Extensions),
        paths: [path.join(__dirname, '../node_modules')]
      });

      var bundler = _.flow(browserify, options.watch ? watchify : _.identity)(opts)
        .transform(lessify)
        .transform(jadeify, { pretty: false })
        .transform(babelify.configure({
          extensions: es6Extensions
        }))
        .transform(stringify({
          extensions: ['.html', '.txt'],
          minify: true,
          minifier: {
            extensions: ['.html']
          }
        }));

      function rebundle() {
        bundle(bundleName, bundler, options);
        console.log('bundled: ' + chalk.magenta(bundleName));
      }

      bundler.on('update', rebundle);

      rebundle();
    });
  });
}

module.exports = build;
