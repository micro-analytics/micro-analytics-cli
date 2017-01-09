const url = require('url')
const { send, createError, sendError } = require('micro')

const db = require('./db')

module.exports = async function (req, res) {
  // Check that a page is provided
  const { pathname, query } = url.parse(req.url, /* parseQueryString */ true)
  if (pathname.length <= 1) {
    throw createError(400, 'Please include a path to a page.')
  }
  if (req.method !== 'GET' && req.method !== 'POST') {
    throw createError(400, 'Please make a GET or a POST request.')
  }
  const shouldIncrement = query.inc !== 'false' && query.inc !== false
  try {
    // Add a view and send the total views back to the client
    if (shouldIncrement) {
      await db.pushView(pathname, { time: Date.now() })
    }
    if (req.method === 'GET') {
      send(res, 200, { views: db.get(pathname).views.length })
    } else {
      send(res, 200)
    }
  } catch (err) {
    console.log(err)
    throw createError(500, 'Internal server error.')
  }
}
