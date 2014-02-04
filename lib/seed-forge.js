/**
 * Dependencies.
 */

var Factory = require('./seed-forge/factory');
var factories = require('./seed-forge/factories');

/**
 * Create and save a factory, found by type.
 *
 * @param {String} Factory name
 * @param {Object} Custom attributes [optional]
 * @param {Function} Callback
 * @api public
 */

function factory(name, attrs, fn) {
  if (arguments.length === 2) {
    fn = attrs;
    attrs = null;
  }

  factories.get(name).create(attrs, fn);
}

/**
 * Create an factory, but don't save it.
 *
 * @param {String} Factory name
 * @param {Object} Custom attributes [optional]
 * @api public
 */

function build(name, attrs) {
  return factories.get(name).build(attrs);
}

/**
 * Return valid attributes for a model.
 *
 * @param {String} name
 * @returns {Object}
 * @api public
 */

function attributes(name) {
  return factories.get(name).attrs();
}

/**
 * Define a factory.
 *
 * @param {String} Type [optional]
 * @param {Function} Seed model
 * @api public
 */

function define(type, Model) {
  if (arguments.length === 1) {
    Model = type;
    type = Model.prototype.__type;
  }

  var factory = new Factory(Model);
  factories.set(type, factory)

  return factory;
}

/**
 * Create multiple records at once.
 *
 * @param {String} Factory name
 * @param {Number} The number of record to be created
 * @param {Function} Callback
 * @api public
 */

function list(type, num, fn) {
  var records = [];

  var created = function (record) {
    records.push(record);
    if (records.length === num) fn(records);
  };

  for (var i = 0; i < num; i++) {
    factory(type, created);
  }
}

/**
 * Exports.
 */

module.exports = factory;
module.exports.define = define;
module.exports.build = build;
module.exports.factory = factory;
module.exports.attributes = attributes;
module.exports.list = list;
