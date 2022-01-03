# multiplatform-express

[![Build Status](https://travis-ci.com/kensnyder/multiplatform-express.svg?branch=master&v=1.0.0)](https://travis-ci.com/kensnyder/multiplatform-express)
[![Code Coverage](https://codecov.io/gh/kensnyder/multiplatform-express/branch/master/graph/badge.svg?v=1.0.0)](https://codecov.io/gh/kensnyder/multiplatform-express)
[![ISC License](https://img.shields.io/npm/l/multiplatform-express.svg?v=1.0.0)](https://opensource.org/licenses/ISC)

Run real Express.js on Node and CloudFlare Workers with the same code

## Goals

Get real express working on CloudFlare workers and allow local testing
through `wrangler dev` or `npx nodemon`

## Installation

There are 3 parts: npm install, configure webpack, update wrangler.toml

### Part 1: npm install

`npm install multiplatform-express`

### Part 2: configure webpack with shims

You'll need to create a webpack.config.js if you don't have one already.
At a minimum, you need keys for target, entry, context and resolve.
The resolve configuration allows shimming node standard libraries into
the Cloudflare Worker runtime. For instance, express requires Node's `fs`
and `net` modules which are not available in web workers.

```js
const path = require('path');
const polyfillsDir = 'node_modules/multiplatform-express/src/node_polyfills';

module.exports = {
  target: 'webworker',
  entry: './index.js',
  context: __dirname,
  resolve: {
    alias: {
      'body-parser': path.resolve(__dirname, polyfillsDir, 'body-parser.js'),
      buffer: path.resolve(__dirname, polyfillsDir, 'buffer.js'),
      process: path.resolve(__dirname, polyfillsDir, 'process.js'),
      fs: path.resolve(__dirname, polyfillsDir, 'fs.js'),
      http: path.resolve(__dirname, polyfillsDir, 'http.js'),
      net: path.resolve(__dirname, polyfillsDir, 'net.js'),
      url: path.resolve(__dirname, polyfillsDir, 'url.js'),
    },
  },
};

```

### Part 3: update wrangler.toml

Add the following anywhere at the root level of your wrangler.toml file:

```toml
webpack_config = 'webpack.config.js'
```

### Peer dependencies

You'll need the following dependencies in your package.json:

```
"buffer": "^6.0.3",
"qs": "^6.10.2",
```

You can add them with the following npm command:

`npm i express@4 buffer qs`

## Additional functionality





## Example Usage



### Unit Tests and Code Coverage

Powered by jest

```bash
npm test
npm run coverage
```

## Contributing

Contributions are welcome. Please open a GitHub ticket for bugs or feature
requests. Please make a pull request for any fixes or new code you'd like to be
incorporated.

## License

Open Source under the [ISC License](https://opensource.org/licenses/ISC).

