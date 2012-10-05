/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

var merge = require('super')
  , filtr = require('filtr')
  , clone = merge
  , factories = {};

function raise (err) {
  if (err) throw err;
};

function define (type, Model) {
  if (arguments.length === 1) {
    Model = type;
    type = Model.prototype.__type;
  }

  var factory = new Factory(Model);
  factories[type] = factory;

  return factory;
};

function Factory (Model) {
  this.Model = Model;
  this.fields = {};
  this.i = 0;
};

// TODO: rename to set
Factory.prototype.set = function (name, value) {
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
  attrs = merge(
    this.attrs(),
    attrs || {}
  );

  return new this.Model(attrs);
};

Factory.prototype.attrs = function () {
  var attrs = {};
  var fields = this.fields;

  if (this.hasParent()) {
    fields = merge(this.parent.fields, fields);
  }

  Object.keys(fields).forEach(function (field) {
    filtr.setPathValue(field, this.value(field, fields), attrs);
  }.bind(this));

  return attrs;
};

Factory.prototype.value = function (field, definition) {
  if (typeof definition[field] !== 'function') {
    return definition[field];
  }

  return (definition[field].length === 0)
    ? definition[field]()
    : definition[field](this.seq())
  ;
};

Factory.prototype.extend = function (name) {
  this.parent = factories[name];
  return this;
};

Factory.prototype.hasParent = function () {
  return !!this.parent;
};

Factory.prototype.seq = function () {
  return (this.hasParent())
    ? this.parent.seq()
    : ++this.i
  ;
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
