// models/message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../db/conn');

const Message_T = sequelize.define('message', {
  message_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true, // ✅ message_id is the only PK
  },
  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'message',
  indexes: [
    {
      unique: true,
      fields: ['manager_id', 'user_id', 'message_id'] // ✅ Enforces uniqueness across triplet
    }
  ]
});

module.exports = Message_T;
