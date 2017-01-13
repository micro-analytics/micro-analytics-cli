const flatfile = require('flat-file-db')
const promise = require('promise')

const db = flatfile.sync(process.env.DB_NAME || 'views.db')

module.exports = {
  put: promise.denodeify(db.put.bind(db)),

  has: (key) => Promise.resolve(db.has(key)),
  get: (key, options) => {
    const value = db.get(key) || { views: [] }

    return {
      views: value.views.filter(view => {
        if (options && options.before && view.time > options.before) return false
        if (options && options.after && view.time < options.after) return false
        return true
      })
    }
  },
  keys: () => Promise.resolve(db.keys()),

  getAll: async function getAll(options) {
    const data = {}
    const keys = await module.exports.keys()

    keys
      .filter(key => key.startsWith(options.pathname))
      .forEach((key) => {
        data[key] = module.exports.get(key, { before: options.before, after: options.after })
      })

    return data
  }
}
