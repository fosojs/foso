'use strict';

var mockery = require('mockery');
var expect = require('chai').expect;

describe('Bundle', function() {
  before(function() {
    mockery.enable({ useCleanCache: true });
  });

  after(function() {
    mockery.disable();
  });

  beforeEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
  });

  it('adds all the registered plugins', function(done) {

    function FosoMock() {
      var plugins = [];

      this.fosify = function(newPlugin) {
        plugins.push(newPlugin);
        return this;
      };

      this.now = function() {
        expect(plugins.length).to.equal(2);
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
          name: 'fosify-foo',
          path: '/path/to/foo/index.js'
        }, {
          name: 'fosify-bar',
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

  it('adds only the required plugins', function(done) {

    function FosoMock() {
      var plugins = [];

      this.fosify = function(newPlugin) {
        plugins.push(newPlugin);
        return this;
      };

      this.now = function() {
        expect(plugins.length).to.equal(1);
        expect(plugins[0]).to.equal('bar');
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
          name: 'fosify-foo',
          path: '/path/to/foo/index.js'
        }, {
          name: 'fosify-bar',
          path: '/path/to/bar/index.js'
        }];
      };
    });

    mockery.registerMock('/path/to/foo/index.js', 'foo');
    mockery.registerMock('/path/to/bar/index.js', 'bar');

    mockery.registerAllowable('../lib/bundle');

    var bundle = require('../lib/bundle');
    bundle(['bar']);
  });
});
