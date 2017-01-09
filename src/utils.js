const db = require('./db')

// Atomic view pushing method, can safely be called multiple times without the
// db messing up.
const pushView = async (key, view) => {
  const locks = {}
  push()

  function push() {
    if (locks[key]) return setImmediate(push)
    locks[key] = true

    let views
    if (db.has(key)) {
      views = db.get(key).views
    } else {
      views = []
    }

    try {
      db.put(key, { views: views.concat([view]) })
        .then(() => {
          delete locks[key]
        })
        .catch(err => { throw err })
    } catch (err) {
      delete locks[key]
      throw err
    }
  }
}

module.exports = exports
exports.pushView = pushView
