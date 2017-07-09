import "reflect-metadata";
import { Container } from "typedi";
import { createConnection } from "typeorm";
import { createKoaServer, Action, ForbiddenError, useContainer } from "routing-controllers";
import { CustomErrorHandler } from './api/middlewares/CustomErrorHandler';
import { Repository } from './api/repository/Repository';


const config = require('config');
const jwt = require('koa-jwt');

const jwtConfig = config.get('jwt');

useContainer(Container);

createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "test_db2",
    entities: [
        __dirname + "/api/models/*.js"
    ],
    autoSchemaSync: true,
}).then(async connection => {
    let repository = Container.get(Repository);
    repository.setConnection(connection);
    createKoaServer({
        defaultErrorHandler: false,
        routePrefix: "/v1",
        authorizationChecker: async (action: Action, claims: string[]) => {
            const verifyJwt = jwt(jwtConfig).unless({ path: ['/v1/auth/token', /^\/v1\/accounts/] });
            await verifyJwt(action.context, () => { });
            const user = action.context.state.user;
            if (!user.role.includes('admin')) {
                return true;
            }
            for (const claim of claims) {
                if (user.scope.includes(claim)) {
                    return true;
                }
            }

            throw new ForbiddenError("you do not have required permissions");
        },
        controllers: [__dirname + "/api/controllers/*.js"],
        middlewares: [CustomErrorHandler]
    }).listen(3000);

}).catch(error => console.log(error));
