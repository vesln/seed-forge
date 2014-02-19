var Invalid = require('./support/models').Invalid;
var User = require('./support/models').User;

var forge = require('../');
var list = forge.list;
var define = forge.define;
var build = forge.build;
var factory = forge.factory;
var attributes = forge.attributes;

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

describe('Seed Forge', function() {
  describe('overriding default attributes', function() {
    it('can be done when building', function() {
      var user = build('User', { age: 44 });
      user.get('age').should.eq(44);
    });

    it('can be done when creating', function(done) {
      factory('User', { age: 44 }, function(err, user) {
        user.fetch(function () {
          user.get('age').should.eq(44);
          done();
        });
      });
    });
  });

  describe('creating a factory', function() {
    it('can save the factory', function(done) {
      factory('User', function(err, user) {
        user.fetch(function() {
          user.get('_id').should.be.not.null;
          user.get('eyes').should.eql({ left: 'blue', right: 'green' });
          user.get('name').should.eq('Name');
          user.get('age').should.eql(33);
          user.get('url').should.eql('http://example.com');

          done();
        });
      });
    });

    it('returns an error if there is one', function() {
      var fn = function() {
        factory('Invalid', function(err, invalid) {
          if (err) throw err;
        });
      };

      fn.should.throw();
    });
  });

  it('can return valid object, but not persisted', function() {
    var user = build('User');

    user.get('name').should.eq('Name');
    user.get('age').should.eq(33);
  });

  it('can return valid attributes', function() {
    var attrs = attributes('User');

    attrs.name.should.eq('Name');
    attrs.age.should.eq(33);
    attrs.url.should.eq('http://example.com');
    attrs.eyes.should.eql({ left: 'blue', right: 'green' });
  });

  it('can handle sequences', function() {
    var first = attributes('User');
    var second = attributes('User');
    var regexp = /example[0-9]+@example.com/;
    first.email.should.not.eq(second.email);
    first.email.should.match(regexp);
    second.email.should.match(regexp);
  });

  it('supports inheritance', function() {
    var user = build('User');
    var admin = build('Admin');

    user.get('eyes').should.eql(admin.get('eyes'));
    user.get('name').should.eq(admin.get('name'));
    user.get('age').should.eq(admin.get('age'));

    user.get('admin').should.eq(false);
    admin.get('admin').should.eq(true);

    user.get('email').should.not.eq(admin.get('emai'));
  });

  describe('hooks', function() {
    it('supports before and after hooks', function(done) {
      var prebuild = false;
      var presave = false;
      var postsave = false;

      define('Filter', User)
        .extend('User')
        .set('admin', true)
        .hook('pre:build', function(next) {
          setImmediate(function() {
            prebuild = true;
            next.should.be.a('function');
            next();
          });
        })
        .hook('pre:save', function(obj, next) {
          setImmediate(function() {
            presave = true;
            obj.should.be.instanceof(User);
            next.should.be.a('function');
            next();
          });
        })
        .hook('post:save', function(obj, next) {
          setImmediate(function() {
            postsave = true;
            obj.should.be.instanceof(User);
            next.should.be.a('function');
            next();
          });
        });

      factory('Filter', function() {
        prebuild.should.be.true;
        presave.should.be.true;
        postsave.should.be.true;
        done();
      });
    });

    it('escalates hook errors', function(done) {
      define('Err', User)
        .extend('User')
        .hook('pre:build', function(next) {
          setImmediate(function() {
            next(new Error('oops'));
          });
        });

      factory('Err', function(err) {
        should.exist(err);
        err.should.be.instanceof(Error);
        err.should.have.property('message', 'oops');
        done();
      });
    });
  });

  it('can create multiple factories at once', function(done) {
    list('User', 10, function(err, users) {
      users.length.should.eq(10);

      users.map(function(user) {
        user.get('_id').should.be.ok;
      });

      done();
    });
  });
});
