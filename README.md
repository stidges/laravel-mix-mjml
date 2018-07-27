# Laravel Mix MJML

A [Laravel Mix](https://github.com/JeffreyWay/laravel-mix) plugin to compile MJML files.

## Installation

This package can be installed through NPM:

```sh
npm install -D laravel-mix-mjml
```

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
mix.mjml(inputPath, outputPath, options);
```

### inputPath

**Type:** String  
**Default:** `"resources/mail"`

The path where the MJML files are located.

### outputPath

**Type:** String
**Default:** `"resources/views/mail"`

The path where the compiled files should be outputted to.

### options.extension

**Type:** String
**Default:** `".blade.php"`

The extension to use when outputting the compiled files.

### options.*

Any other options are passed to the MJML compiler. Please review [the MJML documetation](https://mjml.io/documentation/#inside-node-js) which options are accepted here.

## License

The MIT License (MIT). Please see [License file](LICENSE.md) for more information.
