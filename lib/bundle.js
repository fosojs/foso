'use strict';

var fosify = require('fosify');
var Configstore = require('configstore');

module.exports = function(opts) {
  var conf = new Configstore('foso', { plugins: [] });
  var plugins = conf.get('plugins');

  var f = fosify(opts);
  plugins.forEach(function(plugin) {
    f.plugin(require(plugin.path));
  });
  f.bundle();
};
