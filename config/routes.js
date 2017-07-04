"use strict";

const Router = require('koa-router')
const config = require('config');
const appConfig = config.get('app');
const router = new Router({ prefix: `/${appConfig.version}` });

const PermissionClaims = require('../api/policies/PermissionClaims');
const isAuthorized = require("../api/middlewares/isAuthorized");

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
router.put('/accounts/password', AccountsController.sendPasswordResetLink);
router.put('/accounts/password-reset', AccountsController.resetPassword);

// User routes
router.get('/users', isAuthorized({ permission: PermissionClaims.readUsers }), UsersController.getUsers);
router.get('/users/:id', isAuthorized({ permission: PermissionClaims.readUser }), UsersController.getUser);
router.post('/users', isAuthorized({ permission: PermissionClaims.createUser }), UsersController.createUser);
router.patch('/users/:id', isAuthorized({ permission: PermissionClaims.updateUser }), UsersController.updateUser);
router.put('/users/:id/email', isAuthorized({ permission: PermissionClaims.updateUser }), UsersController.updateEmail);
router.put('/users/:id/password', isAuthorized({ permission: PermissionClaims.updateUser }), UsersController.updatePassword);
router.delete('/users/:id', isAuthorized({ permission: PermissionClaims.deleteUser }), UsersController.deleteUser);

// Role routes
router.get('/roles', isAuthorized({ permission: PermissionClaims.readRoles }), RolesController.getRoles);
router.get('/roles/:id', isAuthorized({ permission: PermissionClaims.readRole }), RolesController.getRole);
router.post('/roles', isAuthorized({ permission: PermissionClaims.createRole }), RolesController.createRole);
router.patch('/roles/:id', isAuthorized({ permission: PermissionClaims.updateRole }), RolesController.updateRole);
router.delete('/roles/:id', isAuthorized({ permission: PermissionClaims.deleteRole }), RolesController.deleteRole);

module.exports = router;
