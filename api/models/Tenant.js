'use strict';

module.exports = function (sequelize, DataTypes) {
    const Tenant = sequelize.define('tenant',
        {
            company: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { notEmpty: { msg: 'company must not be empty' } }
            }
        });
    return Tenant;
};
