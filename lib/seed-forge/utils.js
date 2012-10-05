/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

/**
 * Throw an exception if the supplied argument is
 * an error.
 *
 * @param {Object} Error
 * @api public
 */

function raise (err) {
  if (err) throw err;
};

/*!
 * Expose `raise`.
 */
module.exports.raise = raise;
