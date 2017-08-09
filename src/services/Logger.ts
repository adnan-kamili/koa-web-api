import { Service } from "typedi";
import { existsSync, mkdirSync } from "fs";
import * as Winston from "winston";
import { AppOptions } from "../options/AppOptions";
require("winston-daily-rotate-file");

@Service()
export class Logger {
    private logger: any;
    constructor(private appOptions: AppOptions) {
        // Create the logs folder
        if (!existsSync("logs")) {
            mkdirSync("logs");
        }
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
                level: this.appOptions.logger.level,
                datePattern: "yyyy-MM-dd.",
                prepend: true,
                maxFiles: 10,
                // 10 MB max file size then rotate
                maxsize: 10485760
            })
        ];
        if (this.appOptions.logger.console) {
            transports.push(new Winston.transports.Console({ colorize: true, level: this.appOptions.logger.level }));
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
