# [postcss][postcss]-devtools [![Build Status](https://travis-ci.org/postcss/postcss-devtools.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/postcss-devtools.svg)][npm]

> Log execution time for each plugin in a PostCSS instance.


## Install

With [npm](https://npmjs.org/package/postcss-devtools) do:

```
npm install postcss-devtools --save-dev
```


## Example

Load postcss-devtools into a PostCSS instance and it will wrap each plugin
with a function that logs the time taken for the plugin to perform its
required task. Note that this plugin must be used with the asynchronous API:

```js
var postcss = require('postcss');
var devtools = require('postcss-devtools');
var autoprefixer = require('autoprefixer');

var css = 'h1 { color: red }';

postcss([devtools(), autoprefixer()]).process(css).then(function (result) {
    console.log('Done.');
});

//=> autoprefixer  37 ms
//=> Done.
```


## API

### devtools([options])

#### options

##### precise

Type: `boolean`  
Default: `false`

This adds extra precision to the times that are reported.

##### silent

Type: `boolean`  
Default: `false`

Set this to `true` to use your own logger for the output of this module.

### devtools.printSummary()

Print a summary spanning across all files. Note that you should set
`opts.silent` to `true` to avoid outputting more than is necessary when calling
this function.

```js
var postcss = require('postcss');
var devtools = require('postcss-devtools')({silent: true}); // disable summary for each css file
var autoprefixer = require('autoprefixer');

var cssOne = 'h1 { color: red }';
var cssTwo = 'h1 { color: blue }';
// View a summary for all plugins across all css files
Promise.all(
  postcss([devtools, autoprefixer()]).process(cssOne),
  postcss([devtools, autoprefixer()]).process(cssTwo)
).then(() => {
  console.log('Done.');
  devtools.printSummary();
});
//=> Done.
//=> Summary
//=> autoprefixer  73 ms
```


## Usage

See the [PostCSS documentation](https://github.com/postcss/postcss#usage) for
examples for your environment.


## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.


## License

MIT © [Ben Briggs](http://beneb.info)


[ci]:      https://travis-ci.org/postcss/postcss-devtools
[npm]:     http://badge.fury.io/js/postcss-devtools
[postcss]: https://github.com/postcss/postcss
