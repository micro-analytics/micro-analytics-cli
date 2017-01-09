# `micro-analytics`

Public analytics as a Node.js microservice, no sysadmin experience required.

A tiny analytics server with less than 100 lines of code, easy to run and hack around on. It does one thing, and it does it well: count the views of something and making the views publicly accessible via an API.

(there is currently no frontend to display pretty graphs, feel free to build one yourself!)

## Setup

1. `git clone git@github.com:mxstbr/micro-analytics` to get the repo.
2. `npm install` to install the dependencies.
3. `npm start` to start the service.

And that's it! 🎉 (see [`deployment.md`](./deployment.md) for deployment instructions)

## Usage

### Tracking views

To track a view, simply send a request to `/<yourpath>`. If you send a `GET` request, the request will increment the views and return the total views. If you send a `POST` request, the views will increment but you don't get the total views back.

This is how you'd track pageviews for a website: (though note that this can be used to track anything you want)

```HTML
<script>
  fetch('servicedomain.com' + window.location.pathname)
    // Log total pageviews for current page to console
    .then(response => response.json())
    .then(json => console.log(json.views))
    .catch(err => console.log('Something went wrong:', err))
</script>
```

If you just want to get the views for a path and don't want to increment the views during a `GET` request, set `inc` to `false` in your query parameter. (`/<yourpath>?inc=false`)

If you want to get all views for all paths, set the `all` query parameter to `true`. (`/?all=true`)

## Contributing

If you run `npm run dev` the server will restart every time you edit the code. Perfect for development of `micro-analytics`!

## Built with

- [`micro`](https://github.com/zeit/micro) to create the service.

  `micro` is a lightweight wrapper around Nodes `http.Server` which makes it easy to write ultra-high performance, asynchronous microservices. Perfect for our use case!

- [`flat-file-db`](https://github.com/mafintosh/flat-file-db) to store the data. (and [`promise`](https://github.com/then/promise) to promisify `flat-file-db`)

  `flat-file-db` is a fast in-process flat file database that caches all data in memory and persists it to an open file using an append-only algorithm ensuring compact file sizes and strong consistency. By using the filesystem for storage setup is easy and backups are only a copy & paste away. (in case you need more advanced features of a real database, swapping out `flat-file-db` for a real db shouldn't take long)

## License

Copyright ©️ 2016 Maximilian Stoiber, licensed under the MIT License.
