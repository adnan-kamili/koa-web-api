import { Service } from "typedi";
import { existsSync, mkdirSync } from "fs";
import * as Winston from "winston";
import * as config from "config";
require("winston-daily-rotate-file");

const loggerConfig = config.get<any>("logger");
const transports = [
    new Winston.transports.DailyRotateFile({
        name: "error-file",
        filename: "logs/error.log",
        handleExceptions: true,
        humanReadableUnhandledException: true,
        level: "error",
        datePattern: "yyyy-MM-dd.",
        prepend: true,
        // 10 MB max file size then rotate
        maxsize: 10485760
    }),
    new Winston.transports.DailyRotateFile({
        name: "info-file",
        filename: "logs/info.log",
        level: loggerConfig.level,
        datePattern: "yyyy-MM-dd.",
        prepend: true,
        // 10 MB max file size then rotate
        maxsize: 10485760
    })
];

@Service()
export class Logger {
    private logger: any;
    constructor() {
        // Create the logs folder
        if (!existsSync("logs")) {
            mkdirSync("logs");
        }
        if (loggerConfig.console) {
            transports.push(new Winston.transports.Console({ colorize: true, level: loggerConfig.level }));
        }
        this.logger = new Winston.Logger({ transports });
    }
    info(...args: any[]) {
        this.logger.info(...args);
    }

    error(...args: any[]) {
        this.logger.error(...args);
    }
}
