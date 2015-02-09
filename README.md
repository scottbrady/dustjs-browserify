[![NPM version](https://badge.fury.io/js/dustjs-browserify.svg)](http://badge.fury.io/js/dustjs-browserify)

# dustjs-browserify

Browserify plugin to convert [dustjs templates](https://github.com/linkedin/dustjs) to Javascript.

## Supports dust partials in the browser

This module performs static analysis to detect and browserify templates included using the dust partials syntax.

If your script includes a template with a partial:

```
<p>hello</p>p>
{>"some/template"/}
```

The dustjs-browserify module will also include and browserify the some/template.dust template.

## Installation

This package is available on npm as:

```
npm install dustjs-browserify
```

## Browserify config example

```
transform: [
  [
    {
      path    : 'lib/templates'
      promise : true
    },
    'dustjs-browserify'
  ]
]
```

## Code examples

This module is most useful when you're also using the [dustjs-loader](https://github.com/scottbrady/dustjs-loader) module.

Example using a callback:

```
require('dustjs-loader').register({
  path: 'lib/templates'
});

var template = require('./template.dust');

template({ foo : 42 }, function (error, html) {
  if (error) { ... }
  ...
});
```

Example using a promise:

```
require('dustjs-loader').register({
   path    : 'lib/templates',
   promise : true
});

var template = require('./template.dust');

template({ foo : 42 })
  .then(function (html) {
    ...
  })
  .catch(function (error) {
    ...
  });
```

Both of these examples will work on the server and in the browser.

## Dustjs documentation

* [Dust Tutorial](https://github.com/linkedin/dustjs/wiki/Dust-Tutorial)
* [Dust little less know language constructs](https://github.com/linkedin/dustjs/wiki/Dust-little-less-know-language-constructs)
* [Demo of using template engines with express.js and node.js](https://github.com/chovy/express-template-demo)
* [Original Dustjs project by akdubya](http://akdubya.github.io/dustjs/)

## Security

* [Add additional security filters to Dustjs](https://github.com/linkedin/dustjs-filters-secure)

## License

MIT