'use strict';

var fosify = require('fosify');
var fjs = require('fosify-js');

module.exports = function(opts) {
  fosify(opts).plugin(fjs).bundle();
};
