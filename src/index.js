const micro = require('micro')

const parseArgs = require('./parseArgs')
const db = require('./db');

const flags = parseArgs(process.argv)

db.initDbAdapter(flags.adapter)

const handler = require('./handler')
const server = micro(handler)

server.listen(flags.port, flags.host, (error) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }

  console.log(
    'micro-analytics listening on ' + flags.host + ':' + flags.port + '\n' +
    '  with adapter ' + flags.adapter +
    (db.hasFeature("subscribe") ? '\n  with server side events' : '')
  )
})
