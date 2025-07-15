
// TODO: Not for production - remember to change to sequelize migrations instead for safer schema changes 

const sequelize = require('../db/conn');

const Manager_T = require('./manager');
const Community_T = require('./community');
const LoginPass_T = require('./login_pass');


const initModels = async () => {
// Creates tables if they don’t exist
// Alters existing tables to match your model definitions
  // await sequelize.sync(/* { alter: true } */);
  await sequelize.sync({ alter: true });

  // // LoginPass associations
  // LoginPass_T.hasMany(Manager_T, { foreignKey: 'id' });

  // // Manager associations
  // Manager_T.hasMany(Community_T, { foreignKey: 'manager_id' });
  
  // // Community associations
  // Community_T.belongsTo(Manager_T, { foreignKey: 'manager_id' });

  
};

module.exports = { 
  sequelize, 
  Manager_T,
  Community_T,
  LoginPass_T, 
  initModels 
};
