"use strict";

const Koa = require('koa');
const mount = require('koa-mount');
const config = require('config');
const Logger = require('./api/services/Logger');
const { sequelize } = require('./api/models');

// Import middlewares
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');
const requestLogger = require('koa-logger');
const router = require('./config/routes');

// Import custom middlewares
const errorHandler = require("./api/middlewares/errorHandler");
const httpResponses = require("./api/middlewares/httpResponses");

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
app.use(jwt(jwtConfig).unless({ path: ['/v1/auth/token', /^\/v1\/accounts/] }));

// Body parser middleware
app.use(bodyParser({ limit: '1mb' }));

// Http responses middleware
app.use(httpResponses());

// Router middleware
app.use(router.routes()).use(router.allowedMethods());


// const Provider = require('oidc-provider');
// const issuer = 'http://localhost:4000';
// const configuration = {
//     // ... see available options /docs/configuration.md 
// };
// const clients = [
//     {
//     token_endpoint_auth_method: 'none',
//     client_id: 'mywebsite',
//     grant_types: ['implicit','password'],
//     response_types: ['id_token'],
//     redirect_uris: ['https://client.example.com/cb'],
//   }
// ];

// const oidc = new Provider(issuer, configuration);
// const parameters = ['username', 'password'];

// oidc.registerGrantType('password', function passwordGrantTypeFactory(providerInstance) {
//     return async function passwordGrantType(ctx, next) {
//         if (ctx.oidc.params.username === 'foo' && ctx.oidc.params.password === 'bar') {
//             const AccessToken = providerInstance.AccessToken;
//             const at = new AccessToken({
//                 accountId: 'foo',
//                 clientId: ctx.oidc.client.clientId,
//                 grantId: ctx.oidc.uuid,
//             });

//             const accessToken = await at.save();
//             const expiresIn = AccessToken.expiresIn;

//             ctx.body = {
//                 access_token: accessToken,
//                 expires_in: expiresIn,
//                 token_type: 'Bearer',
//             };
//         } else {
//             ctx.body = {
//                 error: 'invalid_grant',
//                 error_description: 'invalid credentials provided',
//             };
//             ctx.status = 400;
//         }

//         await next();
//     };
// }, parameters);

async function start() {
    try {
        // Check the db connection
        await sequelize.authenticate();
        await sequelize.sync({ force: false });

        // Initialize oidc
        // await oidc.initialize({ clients });
        // app.use(mount('/connect', oidc.app));

        // Start the server
        // app.listen(appConfig.port);
        Logger.info("Environment:", process.env.NODE_ENV);
        Logger.info(`Listening on http://localhost:${appConfig.port}`);
    } catch (error) {
        Logger.error(error.message);
    }
}
start()

module.exports = app.listen(appConfig.port);
