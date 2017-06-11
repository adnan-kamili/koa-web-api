"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require('sequelize');
const config = require('config');

const dbConfig = config.get('database');
const sequelize = new Sequelize(dbConfig.connectionUri, dbConfig);

const db = {};

const modelFiles = fs.readdirSync(__dirname).filter((file) => file !== "index.js")

modelFiles.forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
