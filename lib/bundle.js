'use strict';

var fosify = require('fosify');
var fjs = require('fosify-js');
var fhtml = require('fosify-html');

module.exports = function(opts) {
  fosify(opts)
    .plugin(fjs)
    .plugin(fhtml)
    .bundle();
};
