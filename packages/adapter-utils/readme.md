# `micro-analytics-adapter-utils` 🔧

A set of utilities and tests for creating database adapters.

## Installation

Running your own `micro-analytics` is just two tiny commands away:

```
npm install micro-analytics-adapter-utils
```

## Usage

Detailed information on the usage of the utilities and tests can be found in [writing adapters guide][]

```js
const utils = require('micro-analytics-adapter-utils')
```

#### Tests

There is a complete test suite for adapters in this module. Usage example below, complete lists
of options is in [writing adapters guide][].

```js
// adapter.test.js
const test = require('micro-analytics-adapter-utils/unit-tests')

test({
 name: 'adapter-name',
 modulePath: path.resolve(__dirname, './index.js'),
})
```

## License

Copyright ©️ 2017 Maximilian Stoiber & Rolf Erik Lekang, licensed under the MIT License. See [`license.md`](./license.md) for more information.

[writing adapters guide]: https://github.com/micro-analytics/micro-analytics-cli/blob/master/docs/writing-adapters.md
