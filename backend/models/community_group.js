const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Community_Members_T = sequelize.define('community_group', {
    community_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
  timestamps: false,
  tableName: 'community_group',
});

module.exports = Community_Members_T;
