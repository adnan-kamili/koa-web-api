"use strict";

const Sequelize = require('sequelize');
const db = require('./database');

const Item = db.define('user', {
    name: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING }
});

module.exports = Item;
