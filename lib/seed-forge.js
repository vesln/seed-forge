/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

var merge = require('super');
var clone = merge;

var factories = {};

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
    clone(this.fields),
    attrs || {}
  );

  Object.keys(attrs).forEach(function (field) {
    obj.set(field, attrs[field]);
  });

  return obj;
};

Factory.prototype.attrs = function () {
  // TODO: build an actual object when nested fields are involved.
  return this.fields;
};

function factory (name, attrs, fn) {
  // TODO: check if available
  if (arguments.length === 2) {
    fn = attrs;
    attrs = null;
  }

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
