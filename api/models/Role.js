'use strict';

module.exports = function (sequelize, DataTypes) {
    const Role = sequelize.define('role',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: 'compositeIndex',
                validate: { notEmpty: { msg: 'name must not be empty' } }
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            tenantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: 'compositeIndex'
            }
        },
        {
            hooks: {
                afterValidate: (role) => {
                    role.name = role.name.toString().toLowerCase();
                }
            }
        });
    return Role;
};
