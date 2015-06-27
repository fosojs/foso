'use strict';

var mockery = require('mockery');
var assert = require('assert');

describe('Bundle', function() {
  before(function() {
    mockery.enable();
  });

  after(function() {
    mockery.disable();
  });

  it('adds all the registered plugins', function(done) {

    function FosoMock() {
      var plugins = [];

      this.fosify = function(newPlugin) {
        plugins.push(newPlugin);
        return this;
      };

      this.now = function() {
        assert.equal(plugins.length, 2);
        done();
      };
    }

    mockery.registerMock('./', {
      please: function() {
        return new FosoMock();
      }
    });

    mockery.registerMock('configstore', function Configstore() {
      this.get = function() {
        return [{
          name: 'foo',
          path: '/path/to/foo/index.js'
        }, {
          name: 'bar',
          path: '/path/to/bar/index.js'
        }];
      };
    });

    mockery.registerMock('/path/to/foo/index.js', 'foo');
    mockery.registerMock('/path/to/bar/index.js', 'bar');

    mockery.registerAllowable('../lib/bundle');

    var bundle = require('../lib/bundle');
    bundle();
  });
});
