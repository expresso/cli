@expresso/cli
---

This is a little yep (hopefully) useful tool to run [@expresso/app](https://npmjs.org/package/@expresso/app) apps with (optinally) zero config.
The CLI receives a file path, wich shuold export a function returning a request handler, or an expresso app factory (se [below](#usage) for details); we then read said function, wrap it with [@expresso/app](https://npmjs.org/package/@expresso/app) tell it to use [@expresso/errors](https://npmjs.org/package/@expresso/errors) as error handler and, finally, run it with [@expresso/server](https://npmjs.org/package/@expresso/server).

# Usage

## Single Route
When you have a simngle route, you can export that route's factory and pass it to the `expresso` command.
The factory will receive all config propeties as defined in the config file, plus all [config provided by @expresso/app](https://www.npmjs.com/package/@expresso/app#the-config-object)

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
For now, if you have multiple routes, want to use custom middleware or perform any other custom initialization logic, you should provide an app factory function; the CLI will load said function and feed to to @expresso/app to initalize your application.

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
  > Note: if you don't specify a config file, you should use the `name` option to provide an app name for @expresso/app
- `--path, -p`
  - Route path to be used, when using single route mode; ignored otherwise
  - Default: `'/'`
- `--name, -n`
  - Application name; used by @expresso/app for console display and debugging
  - default: `'expresso-cli'`
  > Note: this will be overriden by the `name` property, if it's present on the config file.
- `--method, -m`
  - HTTP method to use on single route mode; ignored otherwise
  - Default: `'get'`
  - Accepted values: `get`, `post`, `put`, `patch` or `delete`

# Contributing

As with all other [expresso](https://github.com/expresso) libs, PRs are always welcome.

- Fork this
- Clone your fork
- `npm i`
- Do your changes
- `npm run build`
- Test your changes (PRs for automated tests also welcome)
- Open PR
- Done :D

> Note: Make sure your changes don't brake the build, otherwise your PR won't be accepted
