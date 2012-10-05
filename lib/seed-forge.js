/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

var merge = require('super')
  , clone = merge
  , factories = {};

function raise (err) {
  if (err) throw err;
};

function define (Model) {
  var type = Model.prototype.__type;
  var factory = new Factory(Model);

  factories[type] = factory;

  return factory;
};

function Factory (Model) {
  this.Model = Model;
  this.fields = {};
};

Factory.prototype.field = function (name, value) {
  this.fields[name] = value;
  return this;
};

Factory.prototype.create = function (attrs, fn) {
  var obj = this.build(attrs);

  obj.save(function (err) {
    raise(err);
    fn(obj);
  });
};

Factory.prototype.build = function (attrs) {
  var obj = new this.Model;

  attrs = merge(
    this.attrs(),
    attrs || {}
  );

  Object.keys(attrs).forEach(function (field) {
    obj.set(field, attrs[field]);
  });

  return obj;
};

Factory.prototype.attrs = function () {
  var attrs = {}
    , fields = this.fields;

  var value = function(field) {
    return (typeof fields[field] === 'function')
      ? fields[field]()
      : fields[field];
  };

  Object.keys(fields).forEach(function (field) {
    attrs[field] = value(field);
  });

  return attrs;
};

function factory (name, attrs, fn) {
  if (arguments.length === 2) {
    fn = attrs;
    attrs = null;
  }

  // TODO: check if available
  factories[name].create(attrs, fn);
};

function build (name, attrs) {
  return factories[name].build(attrs);
};

function attributes (name) {
  return factories[name].attrs();
};

module.exports.define = define;
module.exports.build = build;
module.exports.factory = factory;
module.exports.create = factory;
module.exports.attributes = attributes;
