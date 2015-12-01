'use strict';

var normalize = require('normalize-path');
var async = require('async');
var path = require('path');
var livereload = require('./livereload');
var R = require('ramda');
var server = require('./server');
var fs = require('fs');
var registerPlugin = require('register-plugin');

function Foso() {
}

/**
 * Creates an instance of Foso.
 *
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
 * @param {Object|Boolean} [opts.serve] - Indicates whether to host the
 *   resources.
 * @param {String} [opts.serve.host] - The non-secure host of the resources.
 *   Is used as the secure one as well if secureHost not passed.
 * @param {String} [opts.serve.secureHost] - The secure host of the resources.
 * @param {String} [opts.baseURL] - The base URL of the resources.
 *   Should not contain the host.
 * @returns {Foso}
 */
Foso.prototype.register = function(plugins, opts) {
  let promise = new Promise(function(resolve, reject) {
    var currentPath = path.resolve(process.cwd());

    opts = opts || {};

    opts.src = normalize(opts.src || './');
    opts.dest = normalize(path.resolve(currentPath, opts.dest || './dist'));
    opts.ignore = opts.ignore || [];

    opts.ignore = R.union(opts.ignore, [
      './**/node_modules/**',
      './**/bower_components/**',
      opts.dest + '/**',
      opts.dest + '/**/test/**'
    ]);

    if (opts.serve) {
      var serverOpts = R.type(opts.serve) === 'Object' ?
        opts.serve : this._getDefaultServe();
      server(opts.dest, serverOpts);
      opts.host = opts.host || 'localhost:' + serverOpts.port;
      if (serverOpts.securePort) {
        opts.secureHost = opts.secureHost ||
          'localhost:' + serverOpts.securePort;
      }
    }

    this.extensions = [];

    registerPlugin(this, plugins, opts, function(err) {
      if (opts.livereload) {
        livereload(opts, this.extensions);
      }
      if (err) {
        reject(err);
        return;
      }
      resolve();
    }.bind(this));
  }.bind(this));

  return promise;
};

Foso.prototype.bundle = function() {
  return new Promise(function(resolve, reject) {
    let getBundles = R.compose(R.map(R.path(['bundle'])), R.values);
    let bundles = getBundles(this.plugins);
    async.series(bundles, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  }.bind(this));
};

Foso.prototype._getDefaultServe = function() {
  var cert = {
    key: fs.readFileSync(__dirname + '/certs/privatekey.pem'),
    cert: fs.readFileSync(__dirname + '/certs/certificate.pem')
  };
  return {
    port: '1769',
    securePort: '1770',
    cert: cert
  };
};

module.exports = Foso;

exports.changed = livereload.changed;
