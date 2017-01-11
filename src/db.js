const flatfile = require('flat-file-db')
const promise = require('promise')

const adapter = require('./flat-file-adapter');

module.exports = {
  get: adapter.get,
  getAll: adapter.getAll,
  put: adapter.put,
  has: adapter.has,
}
