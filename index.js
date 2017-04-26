const path = require('path')
const flatfile = require('flat-file-db')
const promisify = require('then-flat-file-db')
const escapeRegexp = require('escape-regex')
const Observable = require("zen-observable")

const db = promisify(flatfile.sync(path.resolve(process.cwd(), process.env.DB_NAME || 'views.db')))

const keyRegex = (str) => {
  str = str.split('*').map( s => escapeRegexp(s)).join('*')
  return new RegExp('^' + str.replace('*','.*'))
}


let handlers = [];

const observable = new Observable((observer) => {
  handlers.push((data) => observer.next(data))
  let index = handlers.length;
  return () => {
    handlers = [...handlers.slice(0, index), ...handlers.slice(index)]
  }
});

module.exports = {
  put: (key, value) => {
    handlers.forEach(handler => {
      handler({key, value});
    })
    return db.put(key, value)
  },
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
    const keys = (await module.exports.keys()).filter((key) => {
      return options.ignoreWildcard ? key.startsWith(options.pathname) : key.match(keyRegex(options.pathname))
    })

		for (let key of keys) {
			data[key] = await module.exports.get(key, { before: options.before, after: options.after })
		}

		await Promise.all(keys)

    return data
  },
  subscribe: (cb) => {
    return observable.subscribe(cb);
  }
}
