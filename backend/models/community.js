const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Community_T = sequelize.define('community', {
    community_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    subject: {
        type: DataTypes.STRING,
    },
    community_value: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    }
}, {
  timestamps: false,
  tableName: 'community',
});

module.exports = Community_T;
