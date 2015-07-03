'use strict';

var normalize = require('normalize-path');
var async = require('async');
var path = require('path');
var livereload = require('./livereload');
var _ = require('lodash');

function Foso(opts) {
  var currentPath = path.resolve(process.cwd());

  opts = opts || {};

  opts.src = normalize(opts.src || './');
  opts.dest = path.resolve(currentPath, opts.dest || './dist');
  opts.ignore = opts.ignore || [];

  opts.ignore = _.union(opts.ignore, [
    './**/node_modules/**',
    './**/bower_components/**',
    opts.dest + '/**',
    opts.dest + '/test/**'
  ]);

  this._opts = opts;

  this._plugins = [];
}

/**
 * Registers a foso plugin for processing resources.
 * @param {Function} plugin
 * @param {String[]} extensions - The produced file types that will have to be
 *   watched by livereload.
 * @returns {Foso}
 */
Foso.prototype.fosify = function(plugin) {
  if (!plugin) {
    throw new Error('plugin is required');
  }

  this._plugins.push(plugin);

  return this;
};

/**
 * Starts to bundle.
 * @param {Function} [cb] - A callback that will be called when the bundling is
 *   done.
 */
Foso.prototype.now = function(cb) {
  cb = cb || _.noop;
  async.applyEachSeries(this._plugins, this._opts, function(err) {
    if (this._opts.livereload) {
      var extensions = _.union(_.map(this._plugins, function(plugin) {
        return plugin.extensions || [];
      }));
      livereload(this._opts, extensions);
    }
    cb();
  }.bind(this));
};

/**
 * Creates an instance of Foso.
 * @param {Object} opts
 * @param {String} [opts.src=./] - The path to the resources to bundle.
 * @param {String} [opts.dest=./dist] - The destination path for the bundled
 *   resources.
 * @param {String[]} [opts.ignore] - An array of patterns to exclude from
 *   bundling.
 * @param {(Object|Boolean)} [opts.livereload] - Indicates whether to set up a
 *   livereload server.
 * @param {Boolean} [opts.watch=false] - Indicates whether the resources should
 *   be watched for changes.
 * @param {Boolean} [opts.minify=false] - Indicates whether the resources should
 *   be minified during bundling.
 * @returns {Foso}
 */
exports.please = function(opts) {
  return new Foso(opts);
};

exports.changed = livereload.changed;
