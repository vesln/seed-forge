/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

/*!
 * Module dependencies.
 */

var merge = require('super')
  , clone = merge
  , filtr = require('filtr')
  , cyclop = require('cyclop');

/*!
 * Internal dependencies.
 */

var manager = require('./manager')
  , raise = require('./utils').raise;

/**
 * The core factory class.
 *
 * @param {Function} Seed model
 * @api public
 */

function Factory (Model) {
  this.Model = Model;
  this.attributes = {};
  this._before = [];
  this._after = [];
  this.i = 0;
};

/**
 * Set a value for an attribute.
 *
 * @param {String} name
 * @param {Mixed} value
 * @returns `this`
 * @api public
 */

Factory.prototype.set = function (name, value) {
  this.attributes[name] = value;
  return this;
};

/**
 * Set a before filter.
 *
 * @param {String} name
 * @param {Mixed} value
 * @returns `this`
 * @api public
 */

Factory.prototype.before = function (fn) {
  this._before.push(fn);
  return this;
};

/**
 * Set an after filter.
 *
 * @param {String} name
 * @param {Mixed} value
 * @returns `this`
 * @api public
 */

Factory.prototype.after = function (fn) {
  this._after.push(fn);
  return this;
};

/**
 * Build and save a factory.
 *
 * @param {Object} custom attributes [optional]
 * @param {Function} callback
 * @api public
 */

Factory.prototype.create = function (attrs, fn) {
  var self = this;

  this.runFilter(this._before, function() {
    var obj = self.build(attrs)
    obj.save(function (err) {
      raise(err);

      self.runFilter(self._after, function() {
        fn(obj);
      });
    });
  });
};

Factory.prototype.runFilter = function(batch, fn) {
  var manager = cyclop();

  batch.forEach(function(cb) {
    manager.push(cb.bind(this));
  }, this);

  manager.run(fn.bind(this));
};

/**
 * Build a factory.
 *
 * @param {Object} custom attributes [optional]
 * @returns {Object}
 * @api public
 */

Factory.prototype.build = function (attrs) {
  attrs = merge(
    this.attrs(),
    attrs || {}
  );

  return new this.Model(attrs);
};

/**
 * Return own and parent attributes.
 *
 * @returns {Object} attributes
 * @api public
 */

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

/**
 * Extend the current factory.
 *
 * @param {String} Name of the parent factory
 * @returns `this`
 * @api public
 */
Factory.prototype.extend = function (name) {
  this.parent = manager.get(name);
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
Factory.prototype.value = function (attribute, definition) {
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

Factory.prototype.hasParent = function () {
  return !!this.parent;
};

/**
 * Return an integer, unique for the current factory.
 *
 * @returns {Number}
 * @api private
 */

Factory.prototype.seq = function () {
  return (this.hasParent())
    ? this.parent.seq()
    : ++this.i
  ;
};


/*!
 * Expose `Factory`
 */

module.exports = Factory;
