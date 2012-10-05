/*!
 * Seed Forge - factories for Seed.
 *
 * Veselin Todorov <hi@vesln.com>
 * MIT License
 */

var factories = {};

function raise (err) {
  if (err) throw err;
};

function define (Model) {
  var type = Model.prototype.__type;
  var factory = new Factory(Model);

  factories[type] = factory;

  return factory;
};

function Factory (Model) {
  this.fields = {};
  this.Model = Model;
};

Factory.prototype.field = function (name, value) {
  this.fields[name] = value;
  return this;
};

Factory.prototype.create = function (fn) {
  var self = this;
  var obj = new this.Model;

  Object.keys(this.fields).forEach(function (field) {
    obj.set(field, self.fields[field]);
  });

  obj.save(function (err) {
    raise(err);

    fn(obj);
  });
};

function factory (name, fn) {
  // TODO: check if available
  factories[name].create(fn);
};


module.exports.define = define;
module.exports.factory = factory;
