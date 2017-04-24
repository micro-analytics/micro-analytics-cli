
const args = require('args');

module.exports = function parseArgs(argv) {
  return args
    .option(['p', 'port'], 'Port to listen on', process.env.PORT || 3000, Number)
    .option(['H', 'host'], 'Host to listen on', process.env.HOST ||'0.0.0.0')
    .option(['a', 'adapter'], 'Database adapter used', process.env.DB_ADAPTER || 'flat-file-db')
    .parse(argv, { name: 'micro-analytics' })
}
