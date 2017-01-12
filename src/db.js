const flatfile = require('flat-file-db')
const promise = require('promise')

let adapter

if (process.env.DB_ADAPTER) {
  adapter = require('micro-analytics-adapter-' + process.env.DB_ADAPTER)
} else {
  adapter = require('./flat-file-adapter')
}

module.exports = {
  get: adapter.get,
  getAll: adapter.getAll,
  put: adapter.put,
  has: adapter.has,
  keys: adapter.keys,
}
