const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Events_T = sequelize.define('events', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'events',
});

module.exports = Events_T;
