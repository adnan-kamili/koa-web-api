'use strict';

module.exports = function (sequelize, DataTypes) {
    const Role = sequelize.define('role',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: 'compositeIndex'
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
                beforeValidate: (role) => {
                    role.name = role.name.toLowerCase();
                }
            }
        });
    return Role;
};
