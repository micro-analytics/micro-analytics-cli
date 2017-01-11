const redis = require("then-redis")

const host = "your-redis-labs-url"
const port = 11949
const db = redis.createClient({port, host})

db.on('error', err => console.error("redis error: ", err))

module.exports = {
  keys: ()  => db.keys('*'),
  has:  key => db.keys(key),
  put:  (key, value) => {
    value = JSON.stringify(value);
    console.log(`[redis]: SET value ${value}, key ${key}`);
    return db.set(key, value)
  },
  get:  key => db.get(key).then(value => {
    console.log(`[redis]: GET value ${value}, key ${key}`);
    return JSON.parse(value)
  })
}
