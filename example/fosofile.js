'use strict';

let Foso = require('../');
let js = require('fosify-js');
let less = require('fosify-less');
let sass = require('fosify-sass');

let foso = new Foso();

foso
  .register([js, less, sass], {
    src: './scripts',
    dest: './dist',
    host: 'example.com',
    secureHost: 'secure.example.com',
    watch: true,
    minify: true,
    serve: true
  })
  .then(() => foso.bundle())
  .then(() => console.log('bundled'))
  .catch(err => console.error(err));
