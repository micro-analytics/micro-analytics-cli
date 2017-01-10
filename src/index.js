const url = require('url')
const { send, createError, sendError } = require('micro')

const db = require('./db')
const { pushView } = require('./utils')

module.exports = async function (req, res) {
  const { pathname, query } = url.parse(req.url, /* parseQueryString */ true)
  // Send all views down if "?all" is true
  if (String(query.all) === 'true') {
    const body = {
      data: {},
      time: Date.now()
    }
    for (let key of db.keys().filter(key => String(query.filter) === 'false' ? true : key.startsWith(pathname))) {
      body.data[key] = db.get(key)
    }
    if (query.before || query.since) {
      Object.keys(body.data).map(path => {
        body.data[path].views = body.data[path].views.filter(view =>
          query.before
          ? view.time < Number(query.before)
          : view.time > Number(query.since)
        )
      })
    }
    send(res, 200, body)
    return
  }
  // Check that a page is provided
  if (pathname.length <= 1) {
    throw createError(400, 'Please include a path to a page.')
  }
  if (req.method !== 'GET' && req.method !== 'POST') {
    throw createError(400, 'Please make a GET or a POST request.')
  }
  const shouldIncrement = String(query.inc) !== 'false'
  try {
    const currentViews = db.has(pathname) ? db.get(pathname).views.length : 0
    // Add a view and send the total views back to the client
    if (shouldIncrement) {
      await pushView(pathname, { time: Date.now() })
    }
    if (req.method === 'GET') {
      send(res, 200, { views: shouldIncrement ? currentViews + 1 : currentViews })
    } else {
      send(res, 200)
    }
  } catch (err) {
    console.log(err)
    throw createError(500, 'Internal server error.')
  }
}
