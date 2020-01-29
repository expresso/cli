@expresso/cli
---

This is a little yet (hopefully) useful tool to run [@expresso/app](https://npmjs.org/package/@expresso/app) apps with (optionally) zero config.
The CLI receives a file path, wich should export a function returning a request handler, or an expresso app factory (see [below](#usage) for details); we then read said function, wrap it with [@expresso/app](https://npmjs.org/package/@expresso/app) tell it to use [@expresso/errors](https://npmjs.org/package/@expresso/errors) as error handler and, finally, run it with [@expresso/server](https://npmjs.org/package/@expresso/server).

# Usage

## Single Route
When you have a single route, you can export that route's factory and pass it to the `expresso` command.
The factory will receive all config properties as defined in the config file, plus all [config provided by @expresso/app](https://www.npmjs.com/package/@expresso/app#the-config-object)

```shell
expresso route.js -s -c config.js
```

```js
// route.js
const mongodb = require('mongodb')

module.exports = (config) => async (req, res, next) => {
    const mongoDbConnection = await mongodb.connect(config.mongodb.uri)
}
```

```js
// config.js
module.exports = {
    name: 'my-great-app',
    mongodb: {
        uri: process.env.MONGODB_URI
    }
}
```

## Multiple Routes
For now, if you have multiple routes, want to use custom middleware or perform any other custom initialization logic, you should provide an app factory function; the CLI will load said function and feed it to @expresso/app to initalize your application.

> **Note: [@expresso/errors](https://npmjs.org/package/@expresso/errors) is automatically loaded for you, you don't need to load it in your factory function. An option to disable this behaviour can be added provided anyone need it (please open an issue if you do)**

```shell
expresso app.js -n my-awesome-app
```

```js
// app.js
module.exports = function (app, config, environment) => {
    app.get('/myroute', routeHandler)
    app.post('/myotherroute', otherRouteHandler)
}
```

# Options

Usage:
```shell
expresso <fileName> [options]
```

**Arguments:**

- `fileName`: Name of the file which exports the app or route factory

**Options:**

- `--single-route, -s`
  - Switches single route mode on
  - Default: `false`
- `--config, -c`
  - Path to the configuration file
  - Default: `null`
  > Note: if you don't specify a config file, it's nice to use the `name` option to provide an app name for [@expresso/app](https://npmjs.org/package/@expresso/app)
- `--path, -p`
  - Route path to be used, when using single route mode; ignored otherwise
  - Default: `'/'`
- `--name, -n`
  - Application name; used by [@expresso/app](https://npmjs.org/package/@expresso/app) for console display and debugging
  - default: `'expresso-cli'`
  > Note: this will be overriden by the `name` property, if it's present on the config file.
- `--method, -m`
  - HTTP method to use on single route mode; ignored otherwise
  - Default: `'get'`
  - Accepted values: `get`, `post`, `put`, `patch` or `delete`

# Contributing
See [this](CONTRIBUTING.md)
