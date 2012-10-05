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
  .field('url', function() {
    return 'http://example.com';
  })
  .field('eyes.left', 'blue')
  .field('eyes.right', 'green')
  .field('age', 33);

describe('Seed Forge', function () {
  describe('overriding default attributes', function () {
    it('can be done when building', function () {
      var user = build('User', { age: 44 });
      user.get('age').should.eq(44);
    });

    it('can be done when creating', function (done) {
      factory('User', { age: 44 }, function (user) {
        user.fetch(function () {
          user.get('age').should.eq(44);
          done();
        });
      });
    });
  });

  it('can create from factories', function (done) {
    factory('User', function (user) {
      user.fetch(function () {
        user.get('_id').should.be.not.null;
        user.get('eyes').should.eql({ left: 'blue', right: 'green' });
        user.get('name').should.eq('Name');
        user.get('age').should.eql(33);
        user.get('url').should.eql('http://example.com');

        done();
      });
    });
  });

  it('can return valid object, but not persisted', function () {
    var user = build('User');

    user.get('name').should.eq('Name');
    user.get('age').should.eq(33);
  });

  it('can return valid attributes', function () {
    var attrs = attributes('User');

    attrs.should.eql({
      name: 'Name',
      age: 33,
      url: 'http://example.com',
      eyes: { left: 'blue', right: 'green' }
    });
  });

  xit('can create multiple factories at once');
  xit('seq');
  xit('extending a factory');
});
