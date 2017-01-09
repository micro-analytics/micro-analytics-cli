const flatfile = require('flat-file-db')
const promise = require('promise')

const db = flatfile.sync('views')

const promisifiedDb = {
  // Promisify async operations
  put: promise.denodeify(db.put.bind(db)),
  del: promise.denodeify(db.del.bind(db)),
  clear: promise.denodeify(db.clear.bind(db)),

  get: db.get.bind(db),
  has: db.has.bind(db),
  keys: db.keys.bind(db),
  close: db.close.bind(db),
}

// Atomic view pushing method, can safely be called multiple times without the
// db messing up.
const pushView = async (key, view) => {
  const locks = {}
  await push()

  async function push() {
    if (locks[key]) return setImmediate(push)
    locks[key] = true

    let views
    if (promisifiedDb.has(key)) {
      views = promisifiedDb.get(key).views
    } else {
      views = []
    }

    try {
      await promisifiedDb.put(key, { views: views.concat([view]) })
      delete locks[key]
    } catch (err) {
      throw err
    }
  }
}

module.exports = exports = promisifiedDb
exports.pushView = pushView
