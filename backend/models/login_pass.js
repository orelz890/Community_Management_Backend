const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Manager = sequelize.define('login_pass', {
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    is_manager: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pass_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
    }, {
  timestamps: false,
  tableName: 'login_pass',
});

module.exports = Manager;
