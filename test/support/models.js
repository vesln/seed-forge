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
  schema: new seed.Schema({
    name: String,
    url: String,
    eyes: {
      left: String,
      right: String,
    },
    age: Number,
    email: String,
    admin: Boolean,
    disabled: Boolean
  })
});


/**
 * Invalid model (without a storage).
 *
 * @type {Function}
 */

module.exports.Invalid = seed.Model.extend('Invalid', {});
