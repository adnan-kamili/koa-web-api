'use strict';

const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { notEmpty: { msg: 'name must not be empty' } }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: { isEmail: { msg: 'invalid email address' } }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [6, 72],
                        msg: 'password must be atleast 6 characters long'
                    }
                }
            },
            lastLogin: {
                type: DataTypes.DATE,
                allowNull: false
            },
            tenantId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            instanceMethods: {
                comparePassword: async function (password) {
                    const matched = await bcrypt.compare(password, this.password);
                    return matched;
                }
            },
            hooks: {
                afterValidate: async (user) => {
                    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
                }
            }
        });
    return User;
};
