# Foso  [![Dependency Status](https://david-dm.org/zkochan/foso/status.svg?style=flat)](https://david-dm.org/zkochan/foso) [![Build Status](http://img.shields.io/travis/zkochan/foso.svg?style=flat)](https://travis-ci.org/zkochan/foso)

A static server for bundling and serving JavaScript resources.

## Why is it needed?

It can be useful for developing A/B tests or preparing some scripts for DTM.

Foso is especially usefull for writing Optimizely experiments.
A/B testing tools like Optimizely are not good for code writing. Writing code in the browser and reloading the target page every time the code was changed is simply not effective.

With Foso it is possible to write all the code in an editor and the page will be updated automatically each time the code changes were saved.

## How to install it?

```
$ npm install -g foso
```
Add and configure the [Foso Trojan](https://github.com/zkochan/foso-trojan) to all the pages that you want to work with.

## How to use it?

The project structure has to be the following in order to work with Foso.
```
my-experiment
 ├── target-page-type-1
 │   └── index.js
 ├── target-page-type-2
 |   └── index.js
...
 └── target-page-type-n
     └── index.js
```
Running **foso serve** in the root directory will [browserify](http://browserify.org/) all the index.js files in the target folders and serve them on http://localhost:1769

The foso server will host the bundled resources:
```
- target-page-type-1.js
- target-page-type-1.min.js

- target-page-type-2.js
- target-page-type-2.min.js
...
- target-page-type-n.js
- target-page-type-n.min.js
```
To see how the scripts are affecting the website, run `foso.on()` in the console of the page. Foso scripts will be always added to the page until `foso.off()` is executed.

## It can contain more files

The project structure above only shows the files that will be used as entry points for browserify. However, the project can contain many other files and not only JavaScript files.
```
my-experiment
 ├── _components
 |   └── live-chat
 |       ├── index.js
 |       ├── index.css
 |       └── index.html
 ├── target-page-type-1
 |   ├── index.css
 |   ├── foo-template.html
 |   └── index.js
 ├── target-page-type-2
 |   ├── bar.js
 |   ├── foo.js
 |   └── index.js
...
 └── target-page-type-n
     └── index.js
```
Even though this project contains many js files, not all of them will be browserified. This are the rules that foso use to identify browserify entries:

* The file has to be named index.js
* The file has to be one folder deep from the root directory
* The folder name in which the file is shouldn't start with an underscore

Entry points:
```
/homepage/index.js
/default/index.js
/chat/index.js
```
Not entry points:
```
/_homepage/index.js
/homepage/foo.js
/homepage/chat/index.js
```

## Linking everything together

JavaScript, CSS and HTML files can be bundled using `require('modules')`.


License
========

The MIT License (MIT)
