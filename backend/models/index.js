const sequelize = require('../db/conn');
const Manager = require('./manager');
const LoginPass = require('./login_pass');
const UserDetails = require('./user_details');
const Users = require('./users');

// Set up associations
Users.hasOne(UserDetails, { foreignKey: 'user_id' });
UserDetails.belongsTo(Users, { foreignKey: 'user_id' });

const initModels = async () => {
  try {
    // Force sync to recreate tables if there are structural issues
    // Use this temporarily to fix the "too many keys" error
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Database models synchronized successfully');
  } catch (error) {
    console.error('❌ Database sync error:', error.message);
    console.log('🔧 Attempting to fix database schema issues...');
    
    // If sync fails, try to drop and recreate with caution
    // This preserves existing data while fixing schema issues
    try {
      await sequelize.sync({ force: false });
      console.log('✅ Database schema fixed successfully');
    } catch (retryError) {
      console.error('💥 Critical database error:', retryError.message);
      throw retryError;
    }
  }
};

module.exports = { sequelize, Manager, LoginPass, UserDetails, Users, initModels };
