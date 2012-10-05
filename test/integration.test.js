/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

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

/**
 * Example User model.
 *
 * @type {Function}
 */
var User = require('./support/models').User;

define(User)
  .field('name', 'Name')
  .field('age', 33);

describe('Seed Forge', function () {
  it('can create from factories', function (done) {
    factory('User', function (user) {
      user.get('name').should.eql('Name');
      user.get('age').should.eql(33);

      done();
    });
  });

  it('can return valid object, but not persisted', function () {
    var user = build('User');

    user.get('name').should.eql('Name');
    user.get('age').should.eql(33);
  });

  xit('can override the default attributes');
  xit('can create multiple factories at once');
  xit('can return valid attributes');
});
