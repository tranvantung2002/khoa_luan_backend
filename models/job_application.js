import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Job from './job.js';
import User from './user.js';
import Constants from '../utils/constants.js';
const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Job,
      key: 'id'
    },
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(Constants.STATUS_JOB_APPLICATION.PENDING, Constants.STATUS_JOB_APPLICATION.ACCEPT, Constants.STATUS_JOB_APPLICATION.REJECT),
    defaultValue: Constants.STATUS_JOB_APPLICATION.PENDING  
  },
  applied_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  cover_letter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resume_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'job_applications',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['job_id', 'user_id']
    }
  ]
});

JobApplication.belongsTo(Job, { foreignKey: 'job_id' });
JobApplication.belongsTo(User, { foreignKey: 'user_id' });

export default JobApplication;