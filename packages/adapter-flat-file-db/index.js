const path = require('path');
const flatfile = require('flat-file-db');
const promisify = require('then-flat-file-db');
const Observable = require('zen-observable');
const { filterPaths, filterViews } = require('micro-analytics-adapter-utils');

let db;

function init(options) {
  db = promisify(flatfile.sync(path.resolve(process.cwd(), options.dbName || 'views.db')));
}

// This is here for backwards compatability should be removed at some point
init({ dbName: process.env.DB_NAME });

let handlers = [];

const observable = new Observable(observer => {
  handlers.push(data => observer.next(data));
  let index = handlers.length;
  return () => {
    handlers = [...handlers.slice(0, index), ...handlers.slice(index)];
  };
});

module.exports = {
  options: [
    {
      name: 'db-name',
      description: 'The name of the flat-file-db file.',
      defaultValue: process.env.DB_NAME || 'views.db',
    },
  ],
  init,
  put: (key, value) => {
    handlers.forEach(handler => {
      handler({ key, value });
    });
    return db.put(key, value);
  },
  has: key => Promise.resolve(db.has(key)),
  keys: () => Promise.resolve(db.keys()),
  // Get a value and filter it
  get: async (key, options) => {
    let value;
    try {
      value = (await db.get(key)) || {};
    } catch (err) {
      value = { views: [] };
    }

    return {
      views: filterViews(value.views, options),
    };
  },
  // Get all values starting with a certain pathname and filter their views
  getAll: async function getAll(options) {
    const data = {};
    const keys = filterPaths(await module.exports.keys(), options);

    for (let key of keys) {
      data[key] = await module.exports.get(key, {
        before: options.before,
        after: options.after,
      });
    }

    await Promise.all(keys);

    return data;
  },
  subscribe: cb => {
    return observable.subscribe(cb);
  },
  clear: () => {
    db.clear();
  },
};
