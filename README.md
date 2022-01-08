# Laravel Mix MJML

![tests](https://github.com/stidges/laravel-mix-mjml/workflows/tests/badge.svg)

A [Laravel Mix](https://github.com/JeffreyWay/laravel-mix) plugin to compile [MJML](https://mjml.io) files.

## Installation

This package can be installed through NPM:

```sh
npm install -D laravel-mix-mjml
```

## Upgrading to v4.0.0

In previous versions this plugin set the MJML `beautify` option to `true` by default, but since
v4 of MJML this option has been deprecated and will be remove in v5. If you'd still like to use 
this you can add the following to your `webpack.mix.js`:

```js
mix.mjml('...', '...', {
    mjmlOptions: {
        beautify: true
    }
});
```

Additionally v4 of MJML removes the `minify` option. This has been removed from the plugin defaults,
but should not affect the output of your code.

## Basic Usage

```js
// webpack.mix.js
const mix = require('laravel-mix');
require('laravel-mix-mjml');

mix.mjml();
```

## API

The registered `mjml` plugin has the following signature:

```js
mix.mjml(entry, output[, options]);
```

### entry

**Type:** `String`  
**Default:** `"resources/mail"`

The path where the MJML files are located. Can be a path to a specific file, a path to a directory, or a [glob](https://github.com/isaacs/node-glob) string.

### output

**Type:** `String`  
**Default:** `"resources/views/mail"`

The path where the compiled files should be outputted to. **Note:** This path will be resolved relative to your root path!

### options.extension

**Type:** `String`  
**Default:** `".blade.php"`

The extension to use when outputting the compiled files. Ignored if a specific file path is passed as the output path.

### options.mjmlOptions

**Type:** `Object`  
**Default:** `{}`

The options to pass to the MJML compiler. Please review [the MJML documetation](https://mjml.io/documentation/#inside-node-js) which options are accepted here.

## License

The MIT License (MIT). Please see [License file](LICENSE.md) for more information.
