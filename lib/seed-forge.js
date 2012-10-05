/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

var Factory = require('./seed-forge/factory');
var manager = require('./seed-forge/manager');

function factory (name, attrs, fn) {
  if (arguments.length === 2) {
    fn = attrs;
    attrs = null;
  }

  manager.get(name).create(attrs, fn);
};

function build (name, attrs) {
  return manager.get(name).build(attrs);
};

function attributes (name) {
  return manager.get(name).attrs();
};

function define (type, Model) {
  if (arguments.length === 1) {
    Model = type;
    type = Model.prototype.__type;
  }

  var factory = new Factory(Model);

  manager.set(type, factory)

  return factory;
};

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

/**
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

/**
 * An alias for factory.
 */
module.exports.create = factory;

/**
 * Expose `attributes`.
 */
module.exports.attributes = attributes;

/**
 * Expose `list`
 */
module.exports.list = list;
