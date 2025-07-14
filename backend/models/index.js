const sequelize = require('../db/conn');
const Manager_T = require('./manager');

const initModels = async () => {
  await sequelize.sync({ alter: true });
};

module.exports = { sequelize, Manager_T, initModels };
