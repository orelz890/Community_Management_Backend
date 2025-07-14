// models/message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Message_T = sequelize.define('message', {
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chatId: { // Foreign key to chat
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'message'
});

module.exports = Message_T;
