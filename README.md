[![Build Status](https://secure.travis-ci.org/vesln/seed-forge.png)](http://travis-ci.org/vesln/seed-forge)

# Seed Forge

Seed Forge is a powerful factory builder for [Seed](https://github.com/qualiancy/seed) and
[Mongoose](http://mongoosejs.com)

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
  .set('disabled', false);

define('DisabledAdmin', User)
  .extend('Admin')
  .set('disabled', true);
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

### Use hooks for creating relationships

```js
define('Account', Account)
  .hook('pre:save', function(obj, next) {
    if (!obj.get('owner')) { // if (!obj.owner) {
      factory('User', function(err, user) {
        if (err) return next(err);
        obj.set('owner', user);
        next();
      });
    } else {
      next();
    }
  })
```

### Get model attributes from a factory

```js
var attrs = attributes('User');
```

## Install

```
$ npm install seed-forge
```

## License

MIT License
