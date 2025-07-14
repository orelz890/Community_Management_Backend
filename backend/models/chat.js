// models/chat.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Chat_T = sequelize.define('chat', {
  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'chat'
});

module.exports = Chat_T;
