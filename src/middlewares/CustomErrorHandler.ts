import { Middleware, KoaMiddlewareInterface } from "routing-controllers";
import { ValidationError } from "class-validator";

@Middleware({ type: "before" })
export class CustomErrorHandler implements KoaMiddlewareInterface {

    async use(context: any, next: () => Promise<any>): Promise<any> {
        try {
            console.log("do something before execution...");
            await next();
            console.log("do something after execution");
        } catch (error) {
            console.log(error);
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
                //Logger.error(error.message, error);
            } else {
                //Logger.info(error.message);
            }
        }

    }
}