#!/usr/bin/env node
import path from 'path'
import caporal from 'caporal'
import { Express } from 'express'
import expresso from '@expresso/app'
import server from '@expresso/server'
import appFactory from './app-factory'
const metadata = require('../package.json')
import singleRouteFactory from './single-route-factory'

caporal.version(metadata.version)

type Arguments = {
    file: string
}

type Options = {
    singleRoute: boolean
    config: string | undefined
    path: string
    name: string | undefined
    method: keyof Express
}

caporal.description('Run an express powered opinated HTTP server')
    .argument('<file>', 'File to be run', caporal.STRING, 'index.js')
    .option('--single-route, -s', 'Should the file be treated as a single route handler?', caporal.BOOLEAN, false)
    .option('--config, -c <config>', 'App config file', caporal.STRING, null)
    .option('--path, -p <path>', 'Path of the route, if using a single route', caporal.STRING, '/')
    .option('--name, -n <name>', 'App name (overriden by config)', caporal.STRING, 'expresso-cli')
    .option('--method, -m <method>', 'HTTP method if using single route', ['get', 'post', 'put', 'patch', 'delete'], 'get')
    .action((..._args: any[]) => {
        const args: Arguments = _args[0]
        const options: Options = _args[1]

        const fn = require(path.join(process.cwd(), args.file))
        const config = options.config ? require(path.join(process.cwd(), options.config)) : { name: options.name }

        const handlerFactory = options.singleRoute
            ? singleRouteFactory(options.path, options.method, fn)
            : appFactory(fn)

        const app = expresso(handlerFactory)

        server.start(app, config)
    })

// console.log(process.cwd())
caporal.parse(process.argv)