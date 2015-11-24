'use strict';

var expect = require('chai').expect;
var Foso = require('../lib');

describe('Foso', function() {
  it('should pass options to the plugin', function(done) {
    var foso = new Foso();
    function plugin(app, opts, next) {
      expect(opts.src).to.equal('foo');
      next();
    }
    plugin.attributes = {
      name: 'plugin',
      version: '1.0.0'
    };
    foso.register(plugin, {
      src: 'foo'
    }).then(done);
  });
});
