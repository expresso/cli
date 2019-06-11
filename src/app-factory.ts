import { Express } from 'express'
import errors from '@expresso/errors'
import { IExpressoConfigOptions } from '@expresso/app'

const factory = (fn: (app: Express, config: IExpressoConfigOptions, environment: string) => any) => {
    return function (app: Express, config: IExpressoConfigOptions, environment: string) {
        fn(app, config, environment)
        app.use(errors(environment))
    }
}

export default factory