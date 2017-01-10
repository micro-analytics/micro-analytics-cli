# `micro-analytics` 📈

Public analytics as a Node.js microservice, no sysadmin experience required.

[![Build Status](https://travis-ci.org/mxstbr/micro-analytics.svg?branch=master)](https://travis-ci.org/mxstbr/micro-analytics)

A tiny analytics server with less than 100 lines of code, easy to run and hack around on. It does one thing, and it does it well: count the views of something and making the views publicly accessible via an API.

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

#### Time based segmenting

By passing the `?before=<time>` or `?since=<time>` parameters together with `?all=true`, you can limit the views you get returned to a certain time segment. This is useful when your collection of views becomes larger.

## Built with

- [`micro`](https://github.com/zeit/micro) to create the service.

  `micro` is a lightweight wrapper around Nodes `http.Server` which makes it easy to write ultra-high performance, asynchronous microservices. Perfect for our use case!

- [`flat-file-db`](https://github.com/mafintosh/flat-file-db) to store the data. (and [`promise`](https://github.com/then/promise) to promisify `flat-file-db`)

  `flat-file-db` is a fast in-process flat file database that caches all data in memory and persists it to an open file using an append-only algorithm ensuring compact file sizes and strong consistency. By using the filesystem for storage setup is easy and backups are only a copy & paste away. (in case you need more advanced features of a real database, swapping out `flat-file-db` for a real db shouldn't take long)

## License

Copyright ©️ 2016 Maximilian Stoiber, licensed under the MIT License. See [`license.md`](./license.md) for more information.
