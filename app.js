"use strict";

const Koa = require('koa');
const config = require('config');
const Logger = require('./api/services/Logger');
const db = require('./api/models/database');

// Import middlewares
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');
const requestLogger = require('koa-logger');
const router = require('./config/routes');

// Import custom middlewares
const errorHandler = require("./api/middlewares/errorHandler");

// Import configs
const appConfig = config.get('app');
const corsConfig = config.get('cors');
const jwtConfig = config.get('jwt');

const app = new Koa();

// Error handling middleware
app.use(errorHandler());

// Request logger middleware
app.use(requestLogger());

// CORS middleware
app.use(cors(corsConfig));

// JWT middleware for authentication
// App.use(jwt(jwtConfig));

// Body parser middleware
app.use(bodyParser({ limit: '1mb' }));

// Router middleware
app.use(router.routes()).use(router.allowedMethods());

async function start() {
    try {
        // Check the db connection
        await db.authenticate();
        await db.sync();
        // Start the server
        app.listen(appConfig.port);
        Logger.info("Environment:", process.env.NODE_ENV);
        Logger.info(`Listening on http://localhost:${appConfig.port}`);
    } catch (error) {
        Logger.error(error.message);
    }
}
start()

module.exports = app;
