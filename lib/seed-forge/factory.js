/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

/**
 * Module dependencies.
 */
var merge = require('super')
  , clone = merge
  , filtr = require('filtr');

var manager = require('./manager');

var raise = require('./utils').raise;

function Factory (Model) {
  this.Model = Model;
  this.attributes = {};
  this.i = 0;
};

Factory.prototype.set = function (name, value) {
  this.attributes[name] = value;
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
  var ret = {}
    , attributes = this.attributes;

  if (this.hasParent()) {
    attributes = merge(this.parent.attributes, attributes);
  }

  Object.keys(attributes).forEach(function (attribute) {
    filtr.setPathValue(
      attribute,
      this.value(attribute, attributes),
      ret
    );
  }.bind(this));

  return ret;
};

Factory.prototype.value = function (attribute, definition) {
  if (typeof definition[attribute] !== 'function') {
    return definition[attribute];
  }

  return (definition[attribute].length === 0)
    ? definition[attribute]()
    : definition[attribute](this.seq())
  ;
};

Factory.prototype.extend = function (name) {
  this.parent = manager.get(name);
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

module.exports = Factory;
