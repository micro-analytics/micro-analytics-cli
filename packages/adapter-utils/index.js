const isAsyncSupported = require('is-async-supported');

const path = isAsyncSupported() ? './src/index' : './dist/index';

module.exports = require(path);
