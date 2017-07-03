"use strict";

const Router = require('koa-router')
const config = require('config');
const appConfig = config.get('app');

const router = new Router({ prefix: `/${appConfig.version}` });

// Import controllers
const AccountsController = require('../api/controllers/AccountsController');
const UsersController = require('../api/controllers/UsersController');
const RolesController = require('../api/controllers/RolesController');
const AuthController = require('../api/controllers/AuthController');

// Define the api routes

// Auth routes
router.post('/auth/token', AuthController.createToken);

// Account routes
router.post('/accounts', AccountsController.createAccount);

// User routes
router.get('/users', UsersController.getUsers);
router.get('/users/:id', UsersController.getUser);
router.post('/users', UsersController.createUser);
router.patch('/users/:id', UsersController.updateUser);
//router.put('/users/:id/email', UsersController.updateEmail);
//router.put('/users/:id/password', UsersController.updatePassword);
router.delete('/users/:id', UsersController.deleteUser);

// Role routes
router.get('/roles', RolesController.getRoles);
router.get('/roles/:id', RolesController.getRole);
router.post('/roles', RolesController.createRole);
router.patch('/roles/:id', RolesController.updateRole);
router.delete('/roles/:id', RolesController.deleteRole);

module.exports = router;
