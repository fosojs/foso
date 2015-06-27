'use strict';

var foso = require('./');
var Configstore = require('configstore');

module.exports = function(opts) {
  var conf = new Configstore('foso', { plugins: [] });
  var plugins = conf.get('plugins');

  var f = foso.please(opts);
  if (!plugins.length) {
    console.log('WARN: Nothing to fosify. You have no foso plugins installed.');
  }
  plugins.forEach(function(plugin) {
    f.fosify(require(plugin.path));
  });
  f.now();
};
