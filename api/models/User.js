'use strict';

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('User',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
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
                        args: [6, 256],
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
                    await bcrypt.compare(password, this.password);
                }
            },
            hooks: {
                afterValidate: async (user) => {
                    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
                }
            }
        });
};
