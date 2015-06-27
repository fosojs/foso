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
  opts.dest = path.resolve(currentPath, opts.dest || './build');
  opts.ignore = opts.ignore || ['./**/node_modules/**',
                                './**/bower_components/**'];
  this._opts = opts;

  this._plugins = [];
}

Foso.prototype.fosify = function(plugin) {
  if (!plugin) {
    throw new Error('plugin is required');
  }

  this._plugins.push(plugin);

  return this;
};

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

exports.please = function(opts) {
  return new Foso(opts);
};

exports.changed = livereload.changed;
