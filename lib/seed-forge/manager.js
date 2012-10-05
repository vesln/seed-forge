/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

/**
 * Factory manager. Store the factories.
 *
 * @api public
 */

function Manager () {
  this.factories = {};
};

/**
 * Set a factory.
 *
 * @param {String} Name
 * @param {Object} Factory
 * @returns `this`
 * @api public
 */

Manager.prototype.set = function (name, factory) {
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

Manager.prototype.get = function (name) {
  if (!this.factories[name]) {
    throw new Error('The factory "' + name + '" is not defined.');
  }

  return this.factories[name];
};

/*!
 * Expose `Manager`.
 */

module.exports = new Manager;
