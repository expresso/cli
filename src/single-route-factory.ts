import errors from '@expresso/errors'
import { Express, RequestHandler, ErrorRequestHandler } from 'express'
import { IExpressoConfigOptions } from '@expresso/app'

// type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'

type Handler = RequestHandler | ErrorRequestHandler

type RouteFactory<TConfig> = (config: TConfig) => Handler | Handler[]

function factory<TConfig extends IExpressoConfigOptions> (path: string, method: keyof Express, route: RouteFactory<TConfig>) {
    return function (app: Express, config: TConfig, environment: string) {
        if (!app[ method ]) throw new Error(`Invalid method provided: ${method}`)

        app[ method ](path, route(config))
        app.use(errors(environment))
    }
}

export default factory