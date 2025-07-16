// models/user_details.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const User_Details_T = sequelize.define('user_details', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  hebrew_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  years_of_xp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedin_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  facebook_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'user_details',
});

module.exports = User_Details_T;
