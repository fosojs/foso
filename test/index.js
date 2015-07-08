'use strict';

var expect = require('chai').expect;
var foso = require('../lib');

describe('Foso', function() {
  it('should pass options to the plugin', function(done) {
    foso
      .please({
        src: 'foo'
      })
      .fosify(function(opts, cb) {
        expect(opts.src).to.equal('foo');
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
