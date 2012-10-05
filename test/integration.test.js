/**
 * Seed.
 *
 * @type {Object}
 */
var seed = require('seed');

/**
 * With `list` one can create multiple
 * factories at once.
 *
 * @type {Function}
 */
var list = require('../').list;

/**
 * With `define` one can define a factory and
 * rules for it.
 *
 * @type {Function}
 */
var define = require('../').define;

/**
 * `build` builds a valid model object, but not
 * persisted yet.
 *
 * @type {Function}
 */
var build = require('../').build;

/**
 * The factory creator.
 *
 * @type {Function}
 */
var factory = require('../').factory;

describe('Seed Forge', function() {
  xit('can create factories');
  xit('can override the default attributes');
  xit('can create multiple factories at once');
  xit('can return valid attributes');
});
