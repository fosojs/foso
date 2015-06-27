'use strict';

var LiveReload = require('tiny-lr').Server;
var gaze = require('gaze');
var server = null;
var reloadPage = 'index.html';
var _ = require('lodash');
var path = require('path');

var defaultOpts = {
  port: '2769'
};

function livereload(opts, extensions) {
  var passedOpts = typeof opts.livereload === 'object' ? opts.livereload : {};
  var lrOpts = _.extend(passedOpts, defaultOpts);
  server = new LiveReload(lrOpts);
  server.listen(lrOpts.port, '0.0.0.0');

  var watchPattern = './**/*.' +
      (extensions.length === 1 ?
       extensions[0] :
       '{' + extensions.join(',') + '}');
  gaze(path.join(opts.dest, watchPattern), function(err, watcher) {
    watcher.on('changed', function(filePath) {
      server.changed({
        body: {
          files: [filePath]
        }
      });
    });
  });
}

exports = module.exports = livereload;

exports.changed = function() {
  if (server) {
    server.changed({
      body: {
        files: [reloadPage]
      }
    });
  }
};
