# `micro-analytics` 📈

Public analytics as a Node.js microservice, no sysadmin experience required.

[![Build Status](https://travis-ci.org/micro-analytics/micro-analytics-cli.svg?branch=master)](https://travis-ci.org/micro-analytics/micro-analytics) [![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/micro-analytics/micro-analytics-cli)


A tiny analytics server with ~100 lines of code, easy to run and hack around on. It does one thing, and it does it well: count the views of something and making the views publicly accessible via an API.

(there is currently no frontend to display pretty graphs, feel free to build one yourself!)

## Setup

Running your own `micro-analytics` is just two tiny commands away:

```
npm install -g micro-analytics-cli

micro-analytics
```

That's it, the analytics server is now running at `localhost:3000`! 🎉

To deploy a server either refer to [`server-setup.md`](./server-setup.md) for instructions on manually acquiring and setting up a server or use [`now`](https://now.sh) and deploy with a single command:

```
$ now micro-analytics/micro-analytics-cli

> Deployment complete! https://micro-analytics-asfdasdf.now.sh
```

## Usage

### Tracking views

To track a view of `x`, simply send a request to `/x`. This is how you'd track page views for a website: (though note that this can be used to track anything you want)

```HTML
<script>
  fetch('servicedomain.com' + window.location.pathname)
    // Log total pageviews for current page to console
    .then(response => response.json())
    .then(json => console.log(json.views))
    .catch(err => console.log('Something went wrong:', err))
</script>
```

If you send a `GET` request, the request will increment the views and return the total views for the id. (in this case "x") If you send a `POST` request, the views will increment but you don't get the total views back.

#### `GET` the views without incrementing

If you just want to get the views for an id and don't want to increment the views during a `GET` request, set `inc` to `false` in your query parameter. (`/x?inc=false`)

### Getting all views

If you want to get all views for all ids, set the `all` query parameter to `true` on a root request. (i.e. `/?all=true`) If you pass the `all` parameter to an id, all ids starting with that pathname will be included. E.g. `/x?all=true` will match views for `/x`, `/xyz` but not `/y`.

### Options

```
$ micro-analytics --help
Usage: micro-analytics [options] [command]

Commands:

  help  Display help

Options:

  -a, --adapter [value]  Database adapter used (defaults to "flat-file-db")
  -h, --help             Output usage information
  -H, --host [value]     Host to listen on (defaults to "0.0.0.0")
  -p, --port <n>         Port to listen on (defaults to 3000)
  -v, --version          Output the version number
```

### Database adapters

By default, `micro-analytics` uses `flat-file-db`, a fast in-process flat file database, which makes for easy setup and backups.

This works fine for side-project usage, but for a production application with bajillions of visitors you might want to use a real database with a _database adapter_. Install the necessary npm package (e.g. `micro-analytics-adapter-xyz`) and then specify the `DB_ADAPTER` environment variable: `$ DB_ADAPTER=xyz micro-analytics` or use the `--adapter` cli option.

These are the available database adapters, made by the community:

- [`micro-analytics-adapter-redis`](https://github.com/relekang/micro-analytics-adapter-redis)

Don't see your favorite database here? Writing your own adapter is pretty easy, we've even written the tests for you! See [`writing-adapters.md`](writing-adapters.md) for a guide on how to write an adapter for your database of choice.

### Live updates

micro-analytics let's you listen into updates live with [server-sent events][].
That means you can e.g. build a realtime dashboard for your analytics!

Note: Make sure your database adapter supports this feature. If not, bug them to implement it!
micro-analytics will tell you when it starts up if it is supported, so the easiest way to find
out is to start it up.

The example below shows how you can listen for events in the browser, just swap
`my-deploy.now.sh` with your own domain and give it a try:

```es6
const sse = new EventSource('https://my-deploy.now.sh/_realtime')
sse.onopen = function () { console.log('[sse] open') }
sse.onerror = function (error) { console.error('[sse error]', error) }
sse.addEventListener('micro-analytics-ping', function (e) { console.log('[sse]', e) })
```

#### Browser support

Server-sent events are not supported in all browsers. There are great, tiny polyfills available, but before you include one take a look at [the caniuse table][] for server-sent events if you need one based on the browsers you support.

Polyfills that are supported:

* [amvtek/EventSource](https://github.com/amvtek/EventSource)
* [Yaffle/EventSource)](https://github.com/Yaffle/EventSource)
* [remy/polyfills/EventSource.js](https://github.com/remy/polyfills/blob/master/EventSource.js)

> Note: This list is from the documentation of the sse library we use [rexxars/sse-channel][], check that repo because it might have been updated.

[server-sent events]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
[the caniuse table]: http://caniuse.com/#feat=eventsource
[rexxars/sse-channel]: https://github.com/rexxars/sse-channel

## License

Copyright ©️ 2017 Maximilian Stoiber & Rolf Erik Lekang, licensed under the MIT License. See [`license.md`](./license.md) for more information.
