'use strict';

module.exports = function (sequelize, DataTypes) {
    const RoleClaim = sequelize.define('roleClaim',
        {
            claimType: {
                type: DataTypes.STRING,
                allowNull: false
            },
            claimValue: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        { timestamps: false });
    return RoleClaim;
};
