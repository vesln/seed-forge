/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

function Manager () {
  this.factories = {};
};

Manager.prototype.set = function (name, factory) {
  return this.factories[name] = factory;
};

Manager.prototype.get = function (name) {
  if (!this.factories[name]) {
    throw new Error('The factory "' + name + '" is not defined.');
  }

  return this.factories[name];
};

module.exports = new Manager;
