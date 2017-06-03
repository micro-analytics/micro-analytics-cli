const supportsAsyncAwait =
  parseInt(process.version.slice(1).split('.').join('')) > 760;

const path = supportsAsyncAwait ? './src/unit-tests' : './dist/unit-tests';

module.exports = require(path);
