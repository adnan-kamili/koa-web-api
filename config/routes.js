"use strict";

const Router = require('koa-router');
const config = require('config');
const appConfig = config.get('app');

const router = new Router({ prefix: `/api/${appConfig.version}` });

// Import controllers
const UsersController = require('../api/controllers/UsersController');

// Define the api routes

// User routes
router.get('/users', UsersController.getUsers);
router.get('/users/:id', UsersController.getUser);
router.post('/users', UsersController.createUser);
router.patch('/users/:id', UsersController.updateUser);
router.delete('/users/:id', UsersController.deleteUser);

module.exports = router;
