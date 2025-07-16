// models/events.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Events_T = sequelize.define('events', {
  event_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
