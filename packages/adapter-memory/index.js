const { filterViews, filterPaths } = require('micro-analytics-adapter-utils');
const Observable = require('zen-observable');

let data = {};
let handlers = [];

const observable = new Observable(observer => {
  handlers.push(data => observer.next(data));
  let index = handlers.length;
  return () => {
    handlers = [...handlers.slice(0, index), ...handlers.slice(index)];
  };
});

function get(key, options) {
  const value = data[key] || { views: [] };
  return Promise.resolve({ views: filterViews(value.views, options) });
}

function keys() {
  return Promise.resolve(Object.keys(data));
}

function put(key, value) {
  data[key] = value;
  handlers.forEach(handler => {
    handler({ key, value });
  });

  return Promise.resolve();
}

async function getAll(options) {
  const value = {};
  const _keys = filterPaths(await keys(), options);

  for (let key of _keys) {
    value[key] = await get(key, {
      before: options.before,
      after: options.after,
    });
  }

  return Promise.resolve(value);
}

function has(key) {
  return Promise.resolve({}.hasOwnProperty.call(data, key));
}

function clear() {
  data = {};
}

function subscribe(listener) {
  return observable.subscribe(listener);
}

module.exports = { get, put, getAll, has, keys, clear, subscribe };
