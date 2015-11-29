'use strict';

var Foso = require('./');
var Configstore = require('configstore');
var R = require('ramda');

module.exports = function(usePlugins, opts, cb) {
  var conf = new Configstore('foso', { plugins: [] });
  var plugins = conf.get('plugins');
  if (usePlugins && usePlugins.length > 0) {
    plugins = plugins.filter(function(plugin) {
      return usePlugins.indexOf(plugin.name.replace('fosify-', '')) !== -1;
    });
  }

  if (!plugins.length) {
    console.log('WARN: Nothing to fosify. You have no foso plugins installed.');
  }
  var foso = new Foso();
  foso
    .register(plugins.map(plugin => require(plugin.path)), opts)
    .then(() => foso.bundle())
    .then(cb)
    .catch(err => cb(err));
};
