const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Manager_T = sequelize.define('manager', {
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
  tableName: 'manager',
});

module.exports = Manager_T;