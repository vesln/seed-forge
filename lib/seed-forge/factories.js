/**
 * Factory storage.
 *
 * @constructor
 */

function Factories() {
  this.factories = {};
}

/**
 * Set a factory.
 *
 * @param {String} Name
 * @param {Object} Factory
 * @returns `this`
 * @api public
 */

Factories.prototype.set = function(name, factory) {
  return this.factories[name] = factory;
};

/**
 * Get a factory. It throws an exception
 * if the factory is not defined.
 *
 * @param {String} Name
 * @returns {Object}
 * @api public
 */

Factories.prototype.get = function(name) {
  if (!this.factories[name]) {
    throw new Error('The factory "' + name + '" is not defined.');
  }

  return this.factories[name];
};

/**
 * Primary export.
 */

module.exports = new Factories;
