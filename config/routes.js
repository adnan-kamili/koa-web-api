"use strict";

const Router = require('koa-router');
const config = require('config');
const appConfig = config.get('app');

const router = new Router({ prefix: `/api/${appConfig.version}` });

// Import controllers
const ItemsController = require('../api/controllers/ItemsController');

// Define the api routes

// Item routes
router.get('/items', ItemsController.getItems);
router.get('/items/:id', ItemsController.getItem);
router.post('/items', ItemsController.createItem);
router.patch('/items/:id', ItemsController.updateItem);
router.delete('/items/:id', ItemsController.deleteItem);

module.exports = router;
