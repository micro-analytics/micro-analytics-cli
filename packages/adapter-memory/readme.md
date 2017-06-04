# micro-analytics-adapter-memory

This is an in-memory adapter for [micro-analytics][].

#### Why would you want to to use an in memory adapter for micro-analytics?

It can be useful for testing and when deploying test deployments to now.sh.
now does not support writing to the filesystem, which makes micro-analytics
unable to start with the flat-file-db-adapter. In production use, you would
probably want to  use a real database if you care about the data collected.

## Usage

```
npm install micro-analytics-cli micro-analytics-adapter-memory
micro-analytics --adapter memory
```

and open [localhost:3000](https://localhost:3000).

[micro-analytics]: https://github.com/micro-analytics
