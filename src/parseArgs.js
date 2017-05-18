const args = require('args');

function adapterNameFromArgs(argv) {
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '-a' || arg === '--adapter') {
      return argv[i + 1]
    }
    if (/--adapter=/.test(arg)) {
      return arg.split('=')[1]
    }
  }

  return process.env.DB_ADAPTER || 'flat-file-db'
}

module.exports = function parseArgs(argv) {
  const adapterName = adapterNameFromArgs(argv);
  let options = []

  try {
    const adapter =  require(`micro-analytics-adapter-${adapterName}`)
    if (adapter.options) {
      options = adapter.options
    }
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      throw error;
    }
  }

  return args
    .option(['p', 'port'], 'Port to listen on', process.env.PORT || 3000, Number)
    .option(['H', 'host'], 'Host to listen on', process.env.HOST ||'0.0.0.0')
    .option(['a', 'adapter'], 'Database adapter used', process.env.DB_ADAPTER || 'flat-file-db')
    .options(options)
    .parse(argv, { name: 'micro-analytics' })
}
