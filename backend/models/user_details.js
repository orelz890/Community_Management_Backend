const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const UserDetails = sequelize.define('user_details', {
    user_id: {
        primaryKey: true,
        type: DataTypes.STRING(50), // Changed from INTEGER to STRING to match login_pass.id
        allowNull: false,
    },
    hebrew_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    years_of_xp: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    linkedin_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    facebook_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    timestamps: false,
    tableName: 'user_details',
});

module.exports = UserDetails;
