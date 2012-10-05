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
 * @type {function}
 */
var build = require('../').build;

/**
 * The factory creator.
 *
 * @type {function}
 */
var factory = require('../').factory;

/**
 * Factory attributes reader.
 *
 * @type {function}
 */
var attributes = require('../').attributes;

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
      user.fetch(function () {
        user.get('_id').should.be.not.null;
        user.get('name').should.eql('Name');
        user.get('age').should.eql(33);

        done();
      });
    });
  });

  it('can return valid object, but not persisted', function () {
    var user = build('User');

    user.get('name').should.eql('Name');
    user.get('age').should.eql(33);
  });

  it('can return valid attributes', function () {
    var user = attributes('User');
    user.should.eql({ name: 'Name', age: 33 });
  });

  xit('can override the default attributes');
  xit('can create multiple factories at once');
});
