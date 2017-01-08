# `micro-analytics`

Analytics as a simple Node.js microservice.

With less than 50 lines of code this service is the smallest analytics you'll ever need. It does nothing except count the views of a page on your site via an API.

(there is currently no frontend to consume the statistics, though writing one is on the to-do list)

## Built with

- [`micro`](https://github.com/zeit/micro) to create the service.
- [`level`](https://github.com/level/level) to store the data. (and [`then-levelup`](https://github.com/then/then-levelup) to promisify `level`)

## Usage

### Starting the service

1. `git clone git@github.com:mxstbr/micro-analytics` to get the repo.
2. `npm install` to install the dependencies.
3. `npm start` to start the service.

And that's it! 🎉

### Tracking views

To track a view simply send a request to `/<yourpagepath>`. If you send a `GET` request, the request will return the total views. If you send a `POST` request, the views will increment but you're not going to get the total views back.

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

## Gotchas

Currently this uses promisified `level` for data storage, which doesn't have atomic operations. If you have a recommendation for a filesystem-based data storage module for Node that has atomic operations, please let us know!

## Contributing

If you run `npm run dev` the server will restart every time you edit the code. Perfect for development of `micro-analytics`!

## License

Copyright ©️ 2016 Maximilian Stoiber, licensed under the MIT License.
