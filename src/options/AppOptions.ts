import { Service } from "typedi";
import * as config from "config";

import { IApp, IDatabase, IJwt, ICors, ILogger } from "./IOptions";

@Service()
export class AppOptions {
    app: IApp;
    database: IDatabase;
    jwt: IJwt;
    cors: ICors;
    logger: ILogger;

    constructor() {
        this.app = config.get<IApp>("app");
        this.database = config.get<IDatabase>("database");
        this.jwt = config.get<IJwt>("jwt");
        this.cors = config.get<ICors>("cors");
        this.logger = config.get<ILogger>("logger");
    }
}
