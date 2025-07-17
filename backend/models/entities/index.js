const sequelize = require('../../db/conn');

const Manager_T = require('./manager');
const Community_T = require('./community');
const Login_Pass_T = require('./login_pass');
const User_Details_T = require('./user_details');
const Users_T = require('./users');

const Community_Members_T = require('./community_member');
const Community_Group_T = require('./community_group');
const Message_T = require('./message');
const Events_T = require('./events');
const Job_History_T = require('./job_history');

// === Associations ===

// Users <-> UserDetails (1:1)
Users_T.hasOne(User_Details_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',

  // If the referenced primary key is updated, automatically update all related foreign keys as well.
  onUpdate: 'CASCADE'
});

User_Details_T.belongsTo(Users_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Manager <-> Community (1:M)
Manager_T.hasMany(Community_T, {
  foreignKey: 'manager_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Community_T.belongsTo(Manager_T, {
  foreignKey: 'manager_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// LoginPass <-> Manager (1:1)
Login_Pass_T.hasOne(Manager_T, {
  foreignKey: 'manager_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Manager_T.belongsTo(Login_Pass_T, {
  foreignKey: 'manager_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// LoginPass <-> Users (1:1)
Login_Pass_T.hasOne(Users_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Users_T.belongsTo(Login_Pass_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Community <-> CommunityMembers (1:M)
Community_T.hasMany(Community_Members_T, {
  foreignKey: 'community_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Community_Members_T.belongsTo(Community_T, {
  foreignKey: 'community_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// CommunityMembers <-> Users (M:1)
Users_T.hasMany(Community_Members_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Community_Members_T.belongsTo(Users_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Community <-> CommunityGroup (1:M)
Community_T.hasMany(Community_Group_T, {
  foreignKey: 'community_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Community_Group_T.belongsTo(Community_T, {
  foreignKey: 'community_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// CommunityGroup <-> Users (M:1)
Users_T.hasMany(Community_Group_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Community_Group_T.belongsTo(Users_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Message <-> Manager (M:1)
Manager_T.hasMany(Message_T, {
  foreignKey: 'manager_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Message_T.belongsTo(Manager_T, {
  foreignKey: 'manager_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Message <-> Users (M:1)
Users_T.hasMany(Message_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Message_T.belongsTo(Users_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Users <-> Events (1:M)
Users_T.hasMany(Events_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Events_T.belongsTo(Users_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Users <-> JobHistory (1:M)
Users_T.hasMany(Job_History_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Job_History_T.belongsTo(Users_T, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

const initModels = async () => {
  try {
      // await sequelize.sync({ force: false, alter: false });
      // await sequelize.sync({ alter: true });
      await sequelize.sync({ force: true });
      console.log('Database models synchronized successfully');
  } catch (error) {
      console.error('Database sync error:', error.message);
      console.log('Attempting to fix database schema issues...');
  try {
      await sequelize.sync({ force: false });
      console.log('Database schema fixed successfully');
  } catch (retryError) {
      console.error('Critical database error:', retryError.message);
      throw retryError;
  }
  }
};

module.exports = {
  sequelize,
  Manager_T,
  Community_T,
  Login_Pass_T,
  User_Details_T,
  Users_T,
  Community_Members_T,
  Community_Group_T,
  Message_T,
  Events_T,
  Job_History_T,
  initModels
};
