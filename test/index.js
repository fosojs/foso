'use strict';

var assert = require('assert');
var foso = require('../lib');

describe('Foso', function() {
  it('should pass options to the plugin', function(done) {
    foso
      .please({
        src: 'foo'
      })
      .fosify(function(opts, cb) {
        assert.equal(opts.src, 'foo');
        cb();
        done();
      })
      .now();
  });

  it('should execute callback once plugins were executed', function(done) {
    foso
      .please({})
      .fosify(function(opts, cb) {
        cb();
      })
      .now(function() {
        done();
      });
  });
});
