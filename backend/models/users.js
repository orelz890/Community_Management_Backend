const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Users_T = sequelize.define('users', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seniority: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  english_name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'users',
});

module.exports = Users_T;
