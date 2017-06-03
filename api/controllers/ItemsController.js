"use strict";

const BaseController = require('./BaseController');
const NotFoundError = require("../errors/NotFoundError");

class ItemsController extends BaseController {
    static async getItem(ctx) {
        if (ctx.params.id !== "1") {
            ctx.throw(404, 'The item id does not exist!');
            //throw new NotFoundError("The item id does not exist!");
        }
        ctx.body = { id: 1, name: "adnan kamili", email: "adnan.kamili@gmail.com" };
    }
    static async getItems(ctx) {
        ctx.body = [
            { id: 1, name: "adnan kamili", email: "adnan.kamili@gmail.com" }
        ]
    }
    static async createItem(ctx) {
        ctx.body = { message: "this is create" };
    }
    static async updateItem(ctx) {
        ctx.body = { message: "this is update" };
    }
    static async deleteItem(ctx) {
        ctx.body = { message: "this is delete" };
    }
}

module.exports = ItemsController;
