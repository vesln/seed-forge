/**
 * Dependencies.
 */

var Emitter = require('evts');
var merge = require('super');
var inherits = merge.inherits;
var filtr = require('filtr');
var cyclop = require('cyclop');
var factories = require('./factories')
var clone = merge;

/**
 * The core factory class.
 *
 * @param {Function} Seed model
 * @constructor
 */

function Factory(Model) {
  Emitter.call(this);
  this.Model = Model;
  this.attributes = {};
  this.i = 0;
}

inherits(Factory, Emitter);

/**
 * Set a value for an attribute.
 *
 * @param {String} name
 * @param {Mixed} value
 * @returns `this`
 * @api public
 */

Factory.prototype.set = function(name, value) {
  this.attributes[name] = value;
  return this;
};

Factory.prototype.hook = function(key, fn) {
  this.on(key, fn);
  return this;
};

/**
 * Set a pre:build hook.
 *
 * @param {Function} fn
 * @returns `this`
 * @api public
 * @depreciated
 */

Factory.prototype.before = function(fn) {
  return this.hook('pre:build', fn);
};

/**
 * Set an post:save hook.
 *
 * @param {Function} fn
 * @returns `this`
 * @api public
 * @depreciated
 */

Factory.prototype.after = function(fn) {
  // maintain compat with old versions
  return this.hook('post:save', function(obj, next) {
    fn(next);
  });
};

/**
 * Build and save a factory.
 *
 * @param {Object} custom attributes [optional]
 * @param {Function} callback
 * @api public
 */

Factory.prototype.create = function(attrs, fn) {
  var self = this;

  this.emit('pre:build', function(err) {
    if (err) return fn(err);
    var obj = self.build(attrs)
    self.emit('pre:save', obj, function(err) {
      if (err) return fn(err);
      obj.save(function (err) {
        if (err) return fn(err);
        self.emit('post:save', obj, function(err) {
          if (err) return fn(err);
          fn(null, obj);
        });
      });
    });
  });
};

/**
 * Build a factory.
 *
 * @param {Object} custom attributes [optional]
 * @returns {Object}
 * @api public
 */

Factory.prototype.build = function(attrs) {
  attrs = merge( this.attrs(), attrs || {});
  return new this.Model(attrs);
};

/**
 * Return own and parent attributes.
 *
 * @returns {Object} attributes
 * @api public
 */

Factory.prototype.attrs = function() {
  var ret = {}
    , attributes = this.attributes;

  if (this.hasParent()) {
    attributes = merge(this.parent.attributes, attributes);
  }

  Object.keys(attributes).forEach(function(attribute) {
    filtr.setPathValue(
      attribute,
      this.value(attribute, attributes),
      ret
    );
  }.bind(this));

  return ret;
};

/**
 * Extend the current factory.
 *
 * @param {String} Name of the parent factory
 * @returns `this`
 * @api public
 */

Factory.prototype.extend = function(name) {
  this.parent = factories.get(name);
  return this;
};

/**
 * Compute a value for an attribute.
 *
 * @param {String} attribute
 * @param {Object} definition
 * @returns {Mixed}
 * @api private
 */

Factory.prototype.value = function(attribute, definition) {
  if (typeof definition[attribute] !== 'function') {
    return definition[attribute];
  }

  return (definition[attribute].length === 0)
    ? definition[attribute]()
    : definition[attribute](this.seq())
  ;
};

/**
 * Check if the factory has a parent factory.
 *
 * @returns {Boolean}
 * @api private
 */

Factory.prototype.hasParent = function() {
  return !!this.parent;
};

/**
 * Return an integer, unique for the current factory.
 *
 * @returns {Number}
 * @api private
 */

Factory.prototype.seq = function() {
  return this.hasParent()
    ? this.parent.seq()
    : ++this.i;
};

/**
 * Primary export.
 */

module.exports = Factory;
