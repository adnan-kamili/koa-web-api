import { KoaMiddlewareInterface } from "routing-controllers";

export class PaginationHeader implements KoaMiddlewareInterface {

    async use(context: any, next: (err?: any) => Promise<any>): Promise<any> {
        if (context.state.pagination) {
            context.set('Pagination-Count', context.state.pagination.count);
            context.set('Pagination-Page', context.state.pagination.page);
            context.set('Pagination-Limit', context.state.pagination.limit);
        }
        await next();
    }
}