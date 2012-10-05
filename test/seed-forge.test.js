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
 * Invalid model.
 *
 * @type {Function}
 */
var Invalid = require('./support/models').Invalid;

/**
 * Example User model.
 *
 * @type {Function}
 */
var User = require('./support/models').User;

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

define('Admin', User)
  .extend('User')
  .set('admin', true)

define(Invalid);

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

  describe('creating a factory', function() {
    it('can save the factory', function (done) {
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

    it('throws an exception if one occures by saving', function() {
      var fn = function () {
        factory('Invalid', function (invalid) {});
      };

      fn.should.throw();
    });
  });

  it('can return valid object, but not persisted', function () {
    var user = build('User');

    user.get('name').should.eq('Name');
    user.get('age').should.eq(33);
  });

  it('can return valid attributes', function () {
    var attrs = attributes('User');

    attrs.name.should.eq('Name');
    attrs.age.should.eq(33);
    attrs.url.should.eq('http://example.com');
    attrs.eyes.should.eql({ left: 'blue', right: 'green' });
  });

  it('can handle sequences', function () {
    var first = attributes('User')
    , second = attributes('User')
    , regexp = /example[0-9]+@example.com/;

  first.email.should.not.eq(second.email);

  first.email.should.match(regexp);
  second.email.should.match(regexp);
  });

  it('supports inheritance', function () {
    var user = build('User');
    var admin = build('Admin');

    user.get('eyes').should.eql(admin.get('eyes'));
    user.get('name').should.eq(admin.get('name'));
    user.get('age').should.eq(admin.get('age'));

    user.get('admin').should.eq(false);
    admin.get('admin').should.eq(true);

    user.get('email').should.not.eq(admin.get('emai'));
  });

  it('can create multiple factories at once', function (done) {
    list('User', 10, function (users) {
      users.length.should.eq(10);

      users.map(function (user) {
        user.get('_id').should.be.ok;
      });

      done();
    });
  });
});
