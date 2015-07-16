var util = require('util');

function Store() {
  this.data = {};
}

Store.prototype.add = function(id, data) {
  this.data[id] = this.data[id] || [];
  this.data[id].push(util._extend({ timestamp: new Date() }, data));
};

Store.prototype.get = function(id) {
  return this.data[id];
};

Store.prototype.getLast = function(id) {
  if (!this.data[id]) {
    return {};
  }

  return this.data[id][this.data[id].length - 1];
};

module.exports = Store;
