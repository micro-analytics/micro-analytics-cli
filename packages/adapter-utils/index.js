const supportsAsyncAwait =
  parseInt(process.version.slice(1).split('.').join('')) > 760;

const path = supportsAsyncAwait
  ? './src/adapter-utils'
  : './dist/adapter-utils';

module.exports = require(path);
