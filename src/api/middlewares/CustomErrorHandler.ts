import { Middleware, KoaMiddlewareInterface } from "routing-controllers";

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
            context.body = { message: error.message };
            if (context.status === 500) {
                //Logger.error(error.message, error);
            } else {
                //Logger.info(error.message);
            }
        }

    }
}