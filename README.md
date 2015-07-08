# foso

A convention over configuration bundler.

[![Dependency Status](https://david-dm.org/fosojs/foso/status.svg?style=flat)](https://david-dm.org/fosojs/foso)
[![Build Status](https://travis-ci.org/fosojs/foso.svg?branch=master)](https://travis-ci.org/fosojs/foso)
[![npm version](https://badge.fury.io/js/foso.svg)](http://badge.fury.io/js/foso)
[![Join the chat at https://gitter.im/fosojs/foso](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/fosojs/foso?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

![](topimg.jpg)


## How to install it?

```
$ npm install --save-dev foso
```


## Why not Gulp/Grunt or friends?

Gulp is a great task runner and has many libraries for bundling JavaScript and styles. However, a lot of configuration has to be done, to write a good gulpfile. Foso's manifesto is simplicity: everything should be bundled with zero configuration.

Foso does a lot with little effort:

* Bundles the resources with the plugins you install.
* Watches for changes in the source files and rebundles them on change.
* Starts a LiveReload server that will reload the browser each time a bundle was updated.
* Optionally also hosts your resources with a static server.


## Plugins

Foso uses plugins to fosify resources. Here are some plugins available for foso:

* [fosify-js][]
* [fosify-less][]
* [fosify-sass][]
* [fosify-html][]
* [fosify-test][]


## Why is it convention over configuration?

Lets see why foso is convention over configuration on the example of the [Fosify JS][fosify-js] plugin.

When using vanilla Browserify, each JavaScript file that has to be bundled needs to be specified. Fosify will bundle 2 types of JavaScript files:

1. Files that are named **bundle.js** and are not in the root source directory. This files will be bundled, moved one folder up in the destination directory and renamed to the containing folder. For example, **/src/foo/bundle.js** would be bundled to **/dest/foo.js**.
2. Files named **[something].bundle.js**. This files will be moved to the same directory as in the source folder and will be renamed, so that the bundle suffix is gone. For example, **/src/foo/bar.bundle.js** would be bundled to **/dest/foo/bar.js**.

The same conventions work for the less and sass/scss files.


## Usage example in the code

``` js
var foso = require('foso');
var less = require('fosify-less');

foso
  .please({
    src: './',
    dest: './dist',
    watch: true,
    minify: true
  })
  .fosify(less)
  .now();
```

## Using foso as a CLI tool

Everything that is foso you can use from the command line. To use foso as a CLI tool, install it globally:

```
npm install -g foso
```

However, foso is nothing without its plugins. When you install foso plugins globally, they will be used by foso every time you run it. Install some foso plugins globally:

```
npm install -g fosify-js fosify-less fosify-html
```

Now that you have foso and some plugins installed, you can use it to bundle/host your resources.

## Commands

* [serve](#serve)
* [watch](#watch)
* [build](#build)

### Serve

Bundles the resources in the current working directory and sets up a static
server to host them.

Example:
```bash
foso serve
```

You can also specify the list of plugins that will be used against the resources.
By default all the plugins will be used.
```bash
foso serve js less
```

For minifying the resources you can use the `-m` option.
```bash
foso serve -m
```


### Watch

Bundles the resources in the current working directory and re-bundles them when
the source files are updated.

Example:
```bash
foso watch
```

You can also specify the list of plugins that will be used against the resources.
By default all the plugins will be used.
```bash
foso watch js less
```

For minifying the resources you can use the `-m` option.
```bash
foso watch -m
```


### Bundle

Bundles the resources in the current working directory.

Example:
```bash
foso bundle
```

You can also specify the list of plugins that will be used against the resources.
By default all the plugins will be used.
```bash
foso bundle js less
```

For minifying the resources you can use the `-m` option.
```bash
foso bundle -m
```


## License

The MIT License (MIT)

[fosify-js]: https://github.com/fosojs/fosify-js
[fosify-less]: https://github.com/fosojs/fosify-less
[fosify-sass]: https://github.com/fosojs/fosify-sass
[fosify-html]: https://github.com/fosojs/fosify-html
[fosify-test]: https://github.com/fosojs/fosify-test
