const args = require('args');

const repeatCharacter = (char, n) => `${Array(n + 1).join(char)}`

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
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      if (process.env.NODE_ENV !== 'test') {
      // Console.error a warning message, but normally exit the process to avoid printing ugly npm ERR lines and stack trace.
      console.error(`\n${repeatCharacter(' ', 22)}⚠️ ERROR ⚠️\n${repeatCharacter('-', 55)}\nYou specified "${adapterName}" as the DB_ADAPTER, but no package\ncalled "micro-analytics-adapter-${adapterName}" was found.\n\nPlease make sure you spelled the name correctly and\nhave "npm install"ed the necessary adapter package!\n${repeatCharacter('-', 55)}\n`)
      process.exit(0)
      }
    } else {
      throw err
    }
  }

  return args
    .option(['p', 'port'], 'Port to listen on', process.env.PORT || 3000, Number)
    .option(['H', 'host'], 'Host to listen on', process.env.HOST ||'0.0.0.0')
    .option(['a', 'adapter'], 'Database adapter used', process.env.DB_ADAPTER || 'flat-file-db')
    .options(options)
    .parse(argv, { name: 'micro-analytics' })
}
