const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Login_Pass_T = sequelize.define('login_pass', {
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            // unique: true,
        },
        is_manager: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_manager'
        },
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            field: 'id'
        },
        pass_hash: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'pass_hash'
        }
    },
    {
        timestamps: false,
        tableName: 'login_pass',
    });

module.exports = Login_Pass_T;