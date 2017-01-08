# `mxstbr.blog` view counter

A simple Node microservice to count the views of blogposts on `mxstbr.blog`.

## Uses

- [`micro`](https://github.com/zeit/micro) to create the service.
- [`level`](https://github.com/level/level) to store the data.
- [`then-levelup`](https://github.com/then/then-levelup) to promisify `level`.

`views.mxstbr.blog` is hosted on a [DigitalOcean droplet](https://m.do.co/c/d371ed7f99af) (ref link) of the smallest size (5EUR/month), using `pm2` for running it on startup and nginx as a reverse proxy.

## Gotchas

Currently this uses promisified `level` for data storage, which doesn't have atomic operations.

## License

Copyright ©️ 2016 Maximilian Stoiber, licensed under the MIT License.
