# Foso

A static server for bundling and serving JavaScript resources.

[![Dependency Status](https://david-dm.org/zkochan/foso/status.svg?style=flat)](https://david-dm.org/zkochan/foso)
[![Build Status](http://img.shields.io/travis/zkochan/foso.svg?style=flat)](https://travis-ci.org/zkochan/foso)
[![npm version](https://badge.fury.io/js/foso.svg)](http://badge.fury.io/js/foso)

![](topimg.jpg)

## Why is it needed?

It can be useful for developing A/B tests or preparing some scripts for DTM.

Foso is especially usefull for writing Optimizely experiments.
A/B testing tools like Optimizely are not good for code writing. Writing code in the browser and reloading the target page every time the code was changed is simply not effective.

With Foso it is possible to write all the code in an editor and the page will be updated automatically each time the code changes were saved.

You can read more about using Foso with Optimizely [here](http://kochan.io/ab/2015/05/22/coding-ab-tests-effectively.html).

## How to install it?

```
$ npm install -g foso
```

Reference the files that you are serving on your pages. For example, on non-secure pages you'll have to add something like this:
``` html
<script src="http://localhost:1769/index.js"></script>
```
The secure endpoint is `https://localhost:1770`.

You can also add the links using [Kibe](https://github.com/zkochan/kibe). With Kibe you'll just have to write something like

``` js
kibe({
  foso: function(mode) {
    var isSecure = location.protocol === 'https:';
    return [
      location.protocol,
      '//localhost:',
      isSecure ? 1770 : 1769,
      '/index.js'
    ].join('');
  }
});
```

## How to use it?

The project structure has to be the following in order to work with Foso.
```
my-experiment
 ├── target-page-type-1
 │   └── bundle.js
 ├── target-page-type-2
 |   └── bundle.js
...
 └── target-page-type-n
     └── bundle.js
```
Running **foso serve** in the root directory will [browserify](http://browserify.org/) all the bundle.js files in the target folders and serve them on http://localhost:1769

The foso server will host the bundled resources:
```
- target-page-type-1.js
- target-page-type-2.js
...
- target-page-type-n.js
```
To see how the scripts are affecting the website, run `foso.on()` in the console of the page. Foso scripts will be always added to the page until `foso.off()` is executed.

## It can contain more files

The project structure above only shows the files that will be used as entry points for browserify. However, the project can contain many other files and not only JavaScript files.
```
my-experiment
 ├── components
 |   └── live-chat
 |       ├── index.js
 |       ├── index.css
 |       └── index.html
 ├── target-page-type-1
 |   ├── index.css
 |   ├── foo-template.html
 |   └── bundle.js
 ├── target-page-type-2
 |   ├── bar.js
 |   ├── foo.js
 |   └── bundle.js
...
 └── target-page-type-n
     └── bundle.js
```
Even though this project contains many js files, only the ones called bundle.js will be browserified and renamed to the folder name containing them.


## Linking everything together

JavaScript, CSS and HTML files can be bundled using `require('modules')`.


##License

The MIT License (MIT)
