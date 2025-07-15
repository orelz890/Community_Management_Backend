const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Users = sequelize.define('users', {
    user_id: {
        primaryKey: true,
        type: DataTypes.STRING(50), // Changed from INTEGER to STRING to match login_pass.id
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    seniority: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    english_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    timestamps: false,
    tableName: 'users',
});

module.exports = Users;
