"use strict";

const User = require('../models/User');
const BaseController = require('./BaseController');
const NotFoundError = require("../errors/NotFoundError");

class UsersController extends BaseController {
    static async getUser(ctx) {
        if (ctx.params.id !== "1") {
            ctx.throw(404, 'The User id does not exist!');
            //throw new NotFoundError("The User id does not exist!");
        }
        ctx.body = { id: 1, name: "adnan kamili", email: "adnan.kamili@gmail.com" };
    }
    static async getUsers(ctx) {
        ctx.body = [
            { id: 1, name: "adnan kamili", email: "adnan.kamili@gmail.com" }
        ]
    }
    static async createUser(ctx) {
        ctx.body = { message: "this is create" };
    }
    static async updateUser(ctx) {
        ctx.body = { message: "this is update" };
    }
    static async deleteUser(ctx) {
        ctx.body = { message: "this is delete" };
    }
}

module.exports = UsersController;
