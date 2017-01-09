const flatfile = require('flat-file-db')
const promise = require('promise')

const db = flatfile.sync('views')

module.exports = {
  // Promisify async operations
  put: promise.denodeify(db.put.bind(db)),
  del: promise.denodeify(db.del.bind(db)),
  clear: promise.denodeify(db.clear.bind(db)),

  get: db.get.bind(db),
  has: db.has.bind(db),
  keys: db.keys.bind(db),
  close: db.close.bind(db),
}
