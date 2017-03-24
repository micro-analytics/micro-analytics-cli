const micro = require('micro')
const SSE = require('sse')
const args = require('args');

const flags = args
  .option(['p', 'port'], 'Port to listen on', process.env.PORT || 3000, Number)
  .option(['H', 'host'], 'Host to listen on', '0.0.0.0')
  .option(['a', 'adapter'], 'Database adapter used', process.env.DB_ADAPTER || 'flat-file-db')
  .parse(process.argv, { name: 'micro-analytics' })

const db = require('./db');
db.initDbAdapter(flags.adapter)

const handler = require('./handler')
const server = micro(handler)
const sse = new SSE(server)
sse.on('connection', sseHandler)

server.listen(flags.port, flags.host, (error) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }

  console.log(
    'micro-analytics listening on ' + flags.host + ':' + flags.port + ' with adapter ' +
    flags.adapter
  )
})
