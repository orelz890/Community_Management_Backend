const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Community_Members_T = sequelize.define('community_members', {
    community_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
  timestamps: false,
  tableName: 'community_members',
});

module.exports = Community_Members_T;
