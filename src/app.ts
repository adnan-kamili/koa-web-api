import "reflect-metadata";
import { Container } from "typedi";
import { createConnection } from "typeorm";
import * as config from "config";

import { createKoaServer, Action, ForbiddenError, useContainer } from "routing-controllers";
import { CustomErrorHandler } from "./middlewares/CustomErrorHandler";
import { Repository } from "./repository/Repository";
import { Logger } from "./services/Logger";

const jwt = require("koa-jwt");

const jwtConfig = config.get<any>("jwt");
const appConfig = config.get<any>("app");

useContainer(Container);

async function start() {
    const logger = Container.get(Logger);
    try {
        logger.info("connecting to database ...");
        const connection = await createConnection({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "root",
            database: "test_db2",
            entities: [
                __dirname + "/models/*.js"
            ],
            autoSchemaSync: true,
        });
        logger.info("connected to database successfully!");
        const repository = Container.get(Repository);
        repository.setConnection(connection);
        const app = createKoaServer({
            defaultErrorHandler: false,
            routePrefix: `/${appConfig.version}`,
            authorizationChecker: async (action: Action, claims: string[]) => {
                const verifyJwt = jwt(jwtConfig).unless({ path: ["/v1/auth/token", /^\/v1\/accounts/] });
                await verifyJwt(action.context, () => { });
                const user = action.context.state.user;
                if (user.role.includes("admin")) {
                    return true;
                }
                for (const claim of claims) {
                    if (user.scope.includes(claim)) {
                        return true;
                    }
                }

                throw new ForbiddenError("you do not have required permissions");
            },
            controllers: [__dirname + "/controllers/*.js"],
            middlewares: [CustomErrorHandler]
        });
        logger.info("NODE_ENV:", process.env.NODE_ENV);
        logger.info(`listening on http://localhost:${appConfig.port}`);
        app.listen(appConfig.port);
    } catch (error) {
        logger.error(error);
    }

}
start();
