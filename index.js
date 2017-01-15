const flatfile = require('flat-file-db')
const promisify = require('then-flat-file-db')

const db = promisify(flatfile.sync(process.env.DB_NAME || 'views.db'))

module.exports = {
  put: db.put.bind(db),
  has: (key) => Promise.resolve(db.has(key)),
	keys: () => Promise.resolve(db.keys()),
	// Get a value and filter it
  get: async (key, options) => {
    let value
		try {
			value = await db.get(key)
		} catch (err) {
			value = { views: [] }
		}

    return {
      views: value.views.filter(view => {
        if (options && options.before && view.time > options.before) return false
        if (options && options.after && view.time < options.after) return false
        return true
      })
    }
  },
	// Get all values starting with a certain pathname and filter their views
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
