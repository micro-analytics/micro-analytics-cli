# Writing database adapters

`micro-analytics` database adapters are simple JavaScript modules which export an object with some methods. They _have_ to be called `micro-analytics-adapter-xyz`, where `xyz` is the name users will pass to the `DB_ADAPTER` environment variable when starting `micro-analytics`.

If you want to see an example adapter, check out the default [`flat-file-db` adapter](https://github.com/mxstbr/micro-analytics-adapter-flat-file-db)!

This document is written and verified by humans so mistakes might happen. If you find something
to not work, please refer to tests or the flatfile db for how might work at the moment. The tests
described further below are ran against the flat-file-db adapter on every commit so they should be
up to date. Also, if you find any errors in this document please open an issue or pull-request.

## Overview

The methods every adapter has to have are:
- `get(key: string): Promise`: Get a value from the database
- `put(key: string, value: object): Promise`: Put a value into the database
- `has(key: string): Promise`: Check if the database has a value for a certain key
- `getAll(options?): Promise`: Get all values from the database as JSON

All of these methods have to return Promises. On top of that there is some optional methods:

- `init(options: Object): void`: A method to setup the adapter based on
- `subscribe(pathname?: string): Observer`: Subscribe to changes of all keys starting with a certain `pathname`. If no pathname is provided, subscribe to all changes. It returns an Observer (based on the [proposed spec](https://github.com/tc39/proposal-observable))

Furthermore, there are some non callable fields:
- `options: Array<ArgsOption>`: An array of cli options that is needed to configure the adapter. The elements in the list should be compatible with the options of the [args library][args-options]. It is important to read environment variables and put that in the `defaultValue` field to support configuration through environment variables. The parsed options will be passed to `init` described above, thus, `init` is required when options is defined.

[args-options]: https://github.com/leo/args#optionslist

This is what the export of an adapter should thusly look like:

```JS
// index.js
const { init, options, get, put, getAll, has, subscribe } = require('./adapter')

module.exports = {
  init,
  options,
  get,
  put,
  getAll,
  has,
  subscribe,
}
```

## Adapter-utils

Adapters falls mostly into two camps, those who can offload filtering to the database engine and
those who need to do the filtering in JavaScript. If you are writing an adapter for the last group
your in luck. We have a set of utils that are well tested which handles filtering. Read on if you
would like to use or skip to the next section. Keep in mind that you might not need all of these
depending on the database you are using.

### Installation

```
npm install micro-analytics-adapter-utils
```

### `createKeyRegex`
Creates a regex from a wildcard string, e.g. `/p*th`.

Usage: `createKeyRegex(pathname: string): Regex`


### `createPathFilter`
Creates a filter predicate that can be passed into Array.filter based on options. This might be
useful in `getAll`. See also `filterPaths` below.

Usage: `createPathFilter(options: { ignoreWildcard: boolean, pathname: string }):: (path: string) => boolean`

### `filterPaths`
Filters a list of paths based on given options. This might be useful in `getAll`.

Usage: `filterPaths(paths: Array<string>, options: { ignoreWildcard: boolean, pathname: string }): Array<string>`

### `createViewFilter`
Creates a filter predicate that can be passed into Array.filter based on options. It can be used
with a list of views. This might be useful in `get` and `getAll`. See also `filterViews` below.

Usage: `createViewFilter(options: { before: number, after: number }): (view: View) => boolean`

### `filterViews`
Filters a list of views based on given options. This migth be useful in `get` and `getAll`.

Usage: `filterViews(views: Array<View>, options: { before: number, after: number }): Array<View>`

## Tests

There is pre-written tests for adapters that you can use to make sure you adapter is implemented
correctly. These can be easily used by adding jest and micro-analytics-adapter-utils as a dev dependency
to your adapter(e.g. `npm install --save-dev micro-analytics-adapter-utils jest`).
Then create a test file like the one below.

```js
// adapter.test.js
const test = require('micro-analytics-adapter-utils/unit-tests')

test({
 name: 'adapter-name',
 modulePath: path.resolve(__dirname, './index.js'),
})
```

The option object takes the following properties.

* `name` - The name of the adapter
* `modulePath` - The absolute path to the file you refer to in main in package.json
* `beforeEach` - Will be called in jest beforeEach hook, return a promise if it needs to do something async. We recommend cleaning the database here.
* `afterEach` - Will be called in jest afterEach hook, return a promise if it needs to do something async.
* `beforeAll` - Will be called in jest beforeAll hook, return a promise if it needs to do something async.
* `afterAll` - Will be called in jest afterAll hook, return a promise if it needs to do something async.
* `initOptions` - Object passed to `init()`.

Let's dive into the individual methods and what they should do.

## Methods

### `get(key: string, options?: object): Promise`

Should resolve the Promise with an object containing the number of views at that path or, if there is no record with that path yet, reject it.

#### Usage

```JS
try {
  const value = await adapter.get('/hello')
  console.log(value) // { views: 123 }
} catch (err) {/* ... */}
```

#### Options

##### `before?: UTCTime` and `after?: UTCTime`

The adapter should return filter all records returned to only contain the views before `before` and after `after`. The times are passed in UTC, so a simple `record.views[x].time < before` is good enough.

Both, either one or none of them might be specified. It also has to work in conjunction with `pathname`. These are all valid queries, including any further combination of those:

```JS
// Return record with key /hello
await adapter.get('/hello') // -> { views: 125 }

// Return record with key /hello and its number of views that happened before 1234 UTC
await adapter.get('/hello', { before: 1234 }) // -> { views: 100 }

// Return record with key /hello and its number of views that happened 1234 UTC but after 1200 UTC
await adapter.get('/hello', { after: 1200, before: 1234 }) // -> { views: 20 }
```

### `put(key: string, value: object): Promise`

Should resolve the Promise with nothing, if the insertion was successful, and reject with a descriptive error message, if anything went wrong.

#### Usage

```JS
try {
  await adapter.put('/hello', { views: [{ time: 123 }] })
} catch (err) {
  throw err
}
```

### `has(key: string): Promise`

Should resolve the Promise with `true` if the database contains a value for the `key`, or resolve with `false` if the database does not contain a value for `key`.

Should only reject the Promise if something went wrong with the database while checking.

#### Usage

```JS
const pathExists = await adapter.has('/hello')
```

### `getAll(options?): Promise`

Should resolve the promise with all keys and values currently stored in the database as JSON like so:

```JSON
{
  "/hello": {
    "views": [{
      "time": 123
    }, {
      "time": 124
    }]
  },
  "/about": {
    "views": [{
      "time": 122
    }, {
      "time": 125
    }]
  }
}
```

Should resolve to `{}` if nothing was found. Should only reject if something went wrong during the database lookup.

#### Options

The passed `options` can contain the following keys:

```JS
{
  pathname?: string,
  before?: UTCTime,
  after?: UTCTime,
}
```

All of these are optional. Let's examine what each one does individually.

##### `pathname: string`

If a `pathname` is passed the adapter should return all values of keys that _start with_ the path. Examine this query:

```JS
await adapter.getAll({ pathname: '/car' })
```

This would not only return the values for the record with the key `/car`, but also for `/car2`, `/car/make/toyota`, `/caramba`, etc, essentially for _any key that starts with the string `/car`_.

##### `before: UTCTime` and `after: UTCTime`

`getAll` should have the same behaviour as `get` in terms of the filtering.

Here's some examples of valid queries:

```JS
// Return all records
await adapter.getAll() // -> { '/car': { views: [{ time: 1900 }, { time: 1210 }, { time: 1235 }]}}

// Return all keys and their views that happened before 1234 UTC
await adapter.getAll({ before: 1234}) // -> { '/car': { views: [{ time: 1900 }, { time: 1210 }]}}

// Return all keys and their views that happened before 1234 UTC but after 1200 UTC
await adapter.getAll({ after: 1200, before: 1234 }) // -> { '/car': { views: [{ time: 1210 }]}}

// Return all keys that start with /car and their views that happened before 1234 UTC but after 1200 UTC
await adapter.getAll({ pathname: '/car', after: 1200, before: 1234 })
```

### `subscribe(pathname?: string): Observable`

Should return an Observable (based on the proposed [ECMAScript spec](https://github.com/tc39/proposal-observable)) which pings `micro-analytics` whenever a key changes.

If a `pathname` is passed it should have the same behaviour as `getAll`, where it listens to all keys that _start with_ the passed `pathname`.

#### Usage

```JS
const subscription = adapter.subscribe('/hello')({
  next(val) {/* Send new value */},
  error(err) {/* Send error */},
  complete() {/* Cleanup after unsubscription */},
})

// At any time

subscription.unsubscribe()
```

> **Note:** If your database of choice does not support subscriptions, it is fine not to have `adapter.subscribe` as long as you mention that visibly in your documentation.
