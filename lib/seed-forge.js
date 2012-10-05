/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

/*!
 * Internal dependencies.
 */

var Factory = require('./seed-forge/factory');
var manager = require('./seed-forge/manager');

/**
 * Create and save a factory, found by type.
 *
 * @param {String} Factory name
 * @param {Object} Custom attributes [optional]
 * @param {Function} Callback
 * @api public
 */

function factory (name, attrs, fn) {
  if (arguments.length === 2) {
    fn = attrs;
    attrs = null;
  }

  manager.get(name).create(attrs, fn);
};

/**
 * Create an factory, but don't save it.
 *
 * @param {String} Factory name
 * @param {Object} Custom attributes [optional]
 * @api public
 */

function build (name, attrs) {
  return manager.get(name).build(attrs);
};

/**
 * Return valid attributes for a model.
 *
 * @param {String} name
 * @returns {Object}
 * @api public
 */

function attributes (name) {
  return manager.get(name).attrs();
};

/**
 * Define a factory.
 *
 * @param {String} Type [optional]
 * @param {Function} Seed model
 * @api public
 */

function define (type, Model) {
  if (arguments.length === 1) {
    Model = type;
    type = Model.prototype.__type;
  }

  var factory = new Factory(Model);
  manager.set(type, factory)

  return factory;
};


/**
 * Create multiple records at once.
 *
 * @param {String} Factory name
 * @param {Number} The number of record to be created
 * @param {Function} Callback
 * @api public
 */

function list (type, num, fn) {
  var records = [];

  var created = function (record) {
    records.push(record);
    if (records.length === num) fn(records);
  };

  for (var i = 0; i < num; i++) {
    factory(type, created);
  }
};

/*!
 * Module version
 */

module.exports.version = require('../package.json').version;

/*!
 * Expose `define`.
 */

module.exports.define = define;

/**
 * Expose `build`.
 */

module.exports.build = build;

/**
 * Expose `factory`.
 */

module.exports.factory = factory;

/*!
 * An alias for factory.
 */

module.exports.create = factory;

/*!
 * Expose `attributes`.
 */

module.exports.attributes = attributes;

/*!
 * Expose `list`
 */

module.exports.list = list;
