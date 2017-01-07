# `mxstbr.blog` view counter

A simple Node microservice to count the views of blogposts on `mxstbr.blog`.

## Uses

- [`micro`](https://github.com/zeit/micro) to create the service.
- [`level`](https://github.com/level/level) to store the data.
- [`then-levelup`](https://github.com/then/then-levelup) to promisify `level`.

## Gotchas

Currently this uses `level` for data storage, which doesn't have atomic operations. That means a view that happens while another view is registered will override the first view.

## License

Copyright ©️ 2016 Maximilian Stoiber, licensed under the MIT License.
