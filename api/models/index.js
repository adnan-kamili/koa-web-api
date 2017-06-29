'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('config');

const dbConfig = config.get('database');
const sequelize = new Sequelize(dbConfig.connectionUri, dbConfig);

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const db = {};

const modelFiles = fs.readdirSync(__dirname).filter((file) => file !== 'index.js')

modelFiles.forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name.capitalize()] = model;
});

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

// Relationships
db.User.belongsToMany(db.Role, { through: 'userRoles' });
db.Role.belongsToMany(db.User, { through: 'userRoles' });
db.Role.hasMany(db.RoleClaim, {
    as: 'claims',
    onDelete: 'CASCADE'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
