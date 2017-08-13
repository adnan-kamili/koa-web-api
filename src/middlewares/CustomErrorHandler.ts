import { Middleware, KoaMiddlewareInterface } from "routing-controllers";
import { ValidationError } from "class-validator";
import { Logger } from "../services/Logger";

@Middleware({ type: "before" })
export class CustomErrorHandler implements KoaMiddlewareInterface {

    constructor(private logger: Logger) {}

    async use(context: any, next: () => Promise<any>): Promise<any> {
        try {
            const start = Date.now();
            // temporary fix for validaion of query params
            Reflect.setPrototypeOf(context.query, {});
            await next();
            const ms = Date.now() - start;
            context.set("Response-Time", `${ms}ms`);
        } catch (error) {
            context.status = error.httpCode || error.status || 500;
            if (Array.isArray(error.errors) && error.errors.every((element: ValidationError) => element instanceof ValidationError)) {
                let errorMessage = null;
                error.errors.forEach((element: ValidationError) => {
                    Object.keys(element.constraints).forEach((type) => {
                        errorMessage = element.constraints[type];
                        return false;
                    });
                    return false;
                });
                context.body = { message: errorMessage };
            } else {
                context.body = { message: error.message };
            }
            if (context.status === 500) {
                this.logger.error(error.message, error);
            } else {
                this.logger.error(error.message);
            }
        }

    }
}
