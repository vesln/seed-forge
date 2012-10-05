[![Build Status](https://secure.travis-ci.org/vesln/seed-forge.png)](http://travis-ci.org/vesln/seed-forge)

# Seed Forge

Seed Forge is a powerful factory builder for [Seed](https://github.com/qualiancy/seed).

Seed is a storage-agnostic graphing database framework that provides a common API for working
with JSON-style documents.

## Synopsis

### Public methods

```js
var define     = require('seed-forge').define;
var list       = require('seed-forge').list;
var build      = require('seed-forge').build;
var factory    = require('seed-forge').factory;
var attributes = require('seed-forge').attributes;
```

### Define a factory

```js
define(User)
  .set('name', 'Name')
  .set('url', function () {
    return 'http://example.com';
  })
  .set('eyes.left', 'blue')
  .set('eyes.right', 'green')
  .set('email', function (n) {
    return 'example' + n + '@example.com'
  })
  .set('age', 33)
  .set('admin', false);
```

### Inheritance

```js
define('Admin', User)
  .extend('User')
  .set('age', 44)
  .set('admin', true)
```

### Create a record from factory

```js
factory('User', fn);
factory('User', { override: 'attributes' }, fn);
```

### Create multiple records

```js
list('User', 10, fn); // Will create 10 users.
```

### Build a record, without saving it

```js
var user = build('User');
var user = build('User', { override: 'attributes' });
```

### Get model attributes from a factory

```js
var attrs = attributes('User');
```

## Requirements

- NPM (http://npmjs.org/)
- Node.js (http://nodejs.org/) >= 0.6.0

## Install

```
$ npm install seed-forge
```

## Tests

```
$ npm install
$ make test
```

## TODO

- Better docs

## License

MIT License

Copyright (C) 2012 Veselin Todorov (hi@vesln.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
