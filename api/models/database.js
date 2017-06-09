"use strict";

const Sequelize = require('sequelize');
const config = require('config');

const dbConfig = config.get('database');
const db = new Sequelize(dbConfig.connectionUri);
module.exports = db;
