export interface IApp {
    port: number;
    version: string;
}

export interface IDatabase {
    connectionUri: string;
}

export interface IJwt {
    secret: string;
    expiry: number;
}

export interface ICors {
    origin: string;
    maxAge: number;
}

export interface ILogger {
    console: boolean;
    level: string;
}
