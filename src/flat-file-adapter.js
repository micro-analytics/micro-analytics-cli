const flatfile = require('flat-file-db')
const promise = require('promise')

const db = flatfile.sync(process.env.DB_NAME || 'views.db')

module.exports = {
  put: promise.denodeify(db.put.bind(db)),

  has: (key) => Promise.resolve(db.has(key)),
  get: (key) => Promise.resolve(db.get(key)),
  keys: () => Promise.resolve(db.keys()),

  getAll: async function getAll(options) {
    const data = {}
    const keys = await module.exports.keys()

    keys
      .filter(key => String(options.filter) === 'false' ? true : key.startsWith(options.pathname))
      .forEach((key) => {
        data[key] = db.get(key)
      })

    return data
  }
}
