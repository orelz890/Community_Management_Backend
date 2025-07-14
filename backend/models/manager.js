// models/Manager.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Manager = sequelize.define('manager', {
  manager_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'manager', // match your table name exactly
});

module.exports = Manager;
