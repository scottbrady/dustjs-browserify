/*
 * Copyright 2015 Scott Brady
 * MIT License
 * https://github.com/scottbrady/dustjs-browserify/blob/master/LICENSE
 */

var path           = require('path'),
    through        = require('through'),
    dust           = require('dustjs-linkedin'),
    DustjsModulize = require('dustjs-loader/lib/modulize');

/**
 * Browserify plugin to convert dustjs templates to Javascript.
 *
 * Example:
 *
 * $ browserify -t dustjs-browserify foo.dust > bundle.js
 *
 **/

function isDust (filename) {
  return (/\.dust$/).test(filename);
}

module.exports = function (filename, options) {
  var source = '',
      stream;

  if (options == null) {
    options = {};
  }

  if (!isDust(filename)) {
    return through();
  }

  // save a file chunk
  function write (chunk) {
    source += chunk.toString();
  }

  // end the process
  function end () {
    var name     = filename.replace(path.join(process.cwd(), '/'), ''),
        re       = /\.p\("([^"]*)",/g,
        requires = '',
        template,
        compiled,
        match,
        childTemplate,
        childTemplatePath;

    if (options.path) {
      name = name.replace(path.join(options.path, '/'), '');
    }

    name = name.replace(path.extname(name), '');

    template = dust.compile(source, name);

    // find all references to partials
    while (match = re.exec(template)) {
      childTemplate     = match[1];
      childTemplatePath = path.relative(
        path.dirname(filename),
        path.join(process.cwd(), options.path ? options.path : '', childTemplate)
      );

      if (childTemplatePath[0] !== '.') {
        childTemplatePath = './' + childTemplatePath;
      }

      requires += "require('" + childTemplatePath + ".dust');\n";
    }

    template = requires + template;

    if (options.promise) {
      throw new Error('dustjs-browserify: `promise` option is deprecated. Please see README.');
    }

    if (options.promises) {
      compiled = DustjsModulize.wrapWithPromise(name, template, options.promises);
    } else {
      compiled = DustjsModulize.wrap(name, template);
    }

    stream.queue(compiled);

    stream.queue(null);
  }

  stream = through(write, end);

  return stream;
}