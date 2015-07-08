'use strict';

var foso = require('./');
var Configstore = require('configstore');

module.exports = function(usePlugins, opts, cb) {
  var conf = new Configstore('foso', { plugins: [] });
  var plugins = conf.get('plugins');
  if (usePlugins && usePlugins.length > 0) {
    plugins = plugins.filter(function(plugin) {
      return usePlugins.indexOf(plugin.name.replace('fosify-', '')) !== -1;
    });
  }

  var f = foso.please(opts);
  if (!plugins.length) {
    console.log('WARN: Nothing to fosify. You have no foso plugins installed.');
  }
  plugins.forEach(function(plugin) {
    f.fosify(require(plugin.path));
  });
  f.now(cb);
};
