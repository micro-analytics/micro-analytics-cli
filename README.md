# `micro-analytics` 📈

Public analytics as a Node.js microservice, no sysadmin experience required.

[![Build Status](https://travis-ci.org/mxstbr/micro-analytics.svg?branch=master)](https://travis-ci.org/mxstbr/micro-analytics)

A tiny analytics server with ~150 lines of code, easy to run and hack around on. It does one thing, and it does it well: count the views of something and making the views publicly accessible via an API.

(there is currently no frontend to display pretty graphs, feel free to build one yourself!)

## Setup

Running your own `micro-analytics` is just two tiny commands away:

```
npm install -g micro-analytics-cli

micro-analytics
```

That's it, the analytics server is now running at `localhost:3000`! 🎉

See [`server-setup.md`](./server-setup.md) for instructions on acquiring a server and setting up `nginx` to make your `micro-analytics` publicly available.

> **Note**: You can pass any option to the `micro-analytics` command that you can pass to [`micro`](https://github.com/zeit/micro). As an example, to change the host you'd do `micro-analytics -H 127.0.0.1`

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

### Database adapters

By default, `micro-analytics` uses `flat-file-db`, a fast in-process flat file database, which makes for easy setup and backups.

This works fine for side-project usage, but for a production application with bajillions of visitors you might want to use a real database with a _database adapter_. Install the necessary npm package (e.g. `micro-analytics-adapter-xyz`) and then specify the `DB_ADAPTER` environment variable: `$ DB_ADAPTER=xyz micro-analytics`

These are the available database adapters, made by the community:

- [`micro-analytics-adapter-redis`](https://github.com/relekang/micro-analytics-adapter-redis)

Don't see your favorite database here? Writing your own adapter is super easy! See [`writing-adapters.md`](writing-adapters.md) for a simple step-by-step guide.

## License

Copyright ©️ 2017 Maximilian Stoiber, licensed under the MIT License. See [`license.md`](./license.md) for more information.
