/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

/**
 * Seed.
 *
 * @type {Object}
 */
var seed = require('seed');

/**
 * Memory Storage.
 *
 * @type {Object}
 */

var store = new seed.MemoryStore();

/*!
 * An example callback function used in the examples.
 */
var fn = function () {};

/*!
 * Seed-factory methods.
 */
var define     = require('..').define;
var list       = require('..').list;
var build      = require('..').build;
var factory    = require('..').factory;
var attributes = require('..').attributes;

/**
 * Example User model. This should be your
 * model.
 *
 * @type {Function}
 */
var User = seed.Model.extend('User', {
  store: store,
  schema: new seed.Schema({
    name: String,
    url: String,
    eyes: {
      left: String,
      right: String,
    },
    age: Number,
    email: String,
    admin: Boolean,
  })
});

/*!
 * Define `User` factory.
 *
 * Sequences, static values and dynamic values.
 */

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

/*!
 * Inheritance.
 */

define('Admin', User)
  .extend('User')
  .set('age', 44)
  .set('admin', true)


/*!
 * Create a factory.
 */

factory('User', fn);
factory('User', { override: 'attributes' }, fn);

/*!
 * Save multiple records at once.
 */

list('User', 10, fn);

/*!
 * Build a factory, without saving it.
 */

var user = build('User');
var user = build('User', { override: 'attributes' });

/*!
 * Get factory attributes.
 */

var attrs = attributes('User');
