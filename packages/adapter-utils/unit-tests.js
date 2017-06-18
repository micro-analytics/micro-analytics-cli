const isAsyncSupported = require('is-async-supported');

const path = isAsyncSupported() ? './src/unit-tests' : './dist/unit-tests';

module.exports = require(path);
