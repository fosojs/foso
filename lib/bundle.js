'use strict';

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var vfs = require('vinyl-fs');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var _ = require('lodash');
var glob = require('glob');
var watchify = require('watchify');
var browserify = require('browserify');
var lessify = require('node-lessify');
var stringify = require('stringify');
var chalk = require('chalk');

function bundle(bundleName, bundler) {
  return bundler
    .bundle()
    .pipe(source(bundleName))
    .pipe(buffer())
    .pipe(vfs.dest('./dist'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
      extname: '.js'
    }))
    .pipe(vfs.dest('./dist'));
}

function build(basePath) {
  glob(basePath + '/!(_**)/index.js', function (err, files) {
    files.forEach(function (file) {
      var bundleName = file.split('/').splice(-2, 1) + '.js';

      var opts = _.extend(watchify.args, {
        entries: [file]
      });

      var bundler = watchify(browserify(opts))
        .transform(lessify)
        .transform(stringify({
          extensions: ['.html', '.txt'],
          minify: true,
          minifier: {
            extensions: ['.html']
          }
        }));

      function rebundle() {
        bundle(bundleName, bundler);
        console.log('bundled: ' + chalk.magenta(bundleName));
      }

      bundler.on('update', rebundle);

      rebundle();
    });
  });
}

module.exports = build;