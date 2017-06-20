const micro = require('micro');
const noop = () => {};

// Taken from the zeit/micro test suite
// https://github.com/zeit/micro/blob/9bb0f0cb9b9406e08b3bccbcd827d96989b4e16a/test/index.js#L13-L26
const listen = (fn, opts) => {
  const server = micro(fn, opts);

  return new Promise((resolve, reject) => {
    server.listen(err => {
      if (err) {
        return reject(err);
      }
      const { port } = server.address();
      resolve(`http://localhost:${port}`);
    });
  });
};

module.exports = exports = {};
exports.listen = listen;
