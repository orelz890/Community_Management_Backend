const { DataTypes } = require('sequelize');
const sequelize = require('../../db/conn');

const Job_History_T = sequelize.define('job_history', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  start_date: {
    type: DataTypes.DATE,
    primaryKey: true, // ✅ Composite key
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  job_description: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'job_history',
});

module.exports = Job_History_T;
