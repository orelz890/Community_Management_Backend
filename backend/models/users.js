const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Users_T = sequelize.define('users', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seniority: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  english_name: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: false ,
  tableName: 'users',
});

module.exports = Users_T;
