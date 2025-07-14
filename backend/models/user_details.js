const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const User_Details_T = sequelize.define('user_details', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  hebrew_name: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.INTEGER,
  },
  email: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  years_of_xp: {
    type: DataTypes.STRING,
  },
  linkedin_url: {
    type: DataTypes.STRING,
  },
  facebook_url: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
  tableName: 'user_details',
});

module.exports = User_Details_T;
