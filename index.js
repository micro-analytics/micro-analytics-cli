const url = require('url')
const level = require('level')
const then = require('then-levelup')
const { send, createError } = require('micro')

const db = then(level('blog-views'))

module.exports = async function (req, res) {
	// Check that a blogpost is provided
	const { pathname } = url.parse(req.url)
	if (pathname.length <= 1) {
		throw createError(400, 'Please include a path to a blogpost.')
	}
	// Get the views
	let views
	try {
		views = parseInt(await db.get(pathname), 10)
	} catch (err) {
		// If the post doesn't have views yet, initialise the post with one view
		await db.put(pathname, 1)
		send(res, 200, { views: 1 })
		return
	}
	// Increment the views and send them back to client
	await db.put(pathname, views + 1)
	send(res, 200, { views: views + 1 })
}
