const flatfile = require('flat-file-db')
const promise = require('promise')

const db = flatfile.sync(process.env.DB_NAME || 'views.db')

function getAll(options) {
  const data = {};
  const keys = db.keys()
    .filter(key => String(options.filter) === 'false' ? true : key.startsWith(pathname));

  return Promise.resolve(keys.map(key => db.get(key)));
}

module.exports = {
  get: promise.denodeify(db.get.bind(db)),
  put: promise.denodeify(db.put.bind(db)),
  has: promise.denodeify(db.has.bind(db)),
  getAll: getAll,
}
