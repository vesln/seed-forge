/**
 * Seed.
 *
 * @type {Object}
 */
var seed = require('seed');

/**
 * Memory Storage.
 *
 * @type {Object}
 */
var store = new seed.MemoryStore();

/**
 * Example user model.
 *
 * @type {Function}
 */
module.exports.User = seed.Model.extend('User', {
  store: store,
  name: String,
  url: String,
  eyes: {
    left: String,
    right: String,
  },
  age: Number,
  email: String,
  admin: Boolean,
});
