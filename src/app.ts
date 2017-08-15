import "reflect-metadata";
import { Container } from "typedi";
import { createConnection } from "typeorm";

import { createKoaServer, Action, ForbiddenError, useContainer } from "routing-controllers";
import { CustomErrorHandler } from "./middlewares/CustomErrorHandler";
import { Repository } from "./repository/Repository";
import { Logger } from "./services/Logger";
import { AppOptions } from "./options/AppOptions";

const jwt = require("koa-jwt");

useContainer(Container);
const logger = Container.get(Logger);
const appOptions = Container.get(AppOptions);

const app = createKoaServer({
    defaultErrorHandler: false,
    routePrefix: "/v1",
    authorizationChecker: async (action: Action, claims: string[]) => {
        const verifyJwt = jwt(appOptions.jwt).unless({ path: ["/v1/auth/token", /^\/v1\/accounts/] });
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
export async function start() {
    try {
        logger.info("connecting to database ...");
        const connection = await createConnection({
            type: "postgres",
            url: appOptions.database.connectionUri,
            entities: [
                __dirname + "/models/*.js"
            ],
            autoSchemaSync: true
        });
        logger.info("connected to database successfully!");
        const repository = Container.get(Repository);
        repository.setConnection(connection);
        logger.info("NODE_ENV:", process.env.NODE_ENV);
        logger.info(`listening on http://localhost:${appOptions.app.port}`);
        if (process.env.NODE_ENV !== "testing") {
            app.listen(appOptions.app.port);
        }
    } catch (error) {
        logger.error(error);
    }
}
if (process.env.NODE_ENV === "testing") {
    exports.app = app.listen(appOptions.app.port);
} else {
    start();
}
