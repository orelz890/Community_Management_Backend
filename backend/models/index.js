const sequelize = require('../db/conn');
const Manager = require('./manager');

const initModels = async () => {
  await sequelize.sync({ alter: true });
};

module.exports = { sequelize, Manager, initModels };
