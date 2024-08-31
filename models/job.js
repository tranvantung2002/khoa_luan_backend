import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";
import Company from './company.js'; 
import Location from './location.js'; 
import Industry from './industry.js'; 
import Constants from "../utils/constants.js";

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Company,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Location,
      key: 'id'
    }
  },
  salary: {
    type: DataTypes.STRING(50)
  },
  industry_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Industry,
      key: 'id'
    }
  },
  working_time: {
    type: DataTypes.STRING(255),
  },
  expires_at: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM(Constants.STATUS_JOB.ACTIVE, Constants.STATUS_JOB.INACTIVE),
    defaultValue: Constants.STATUS_JOB.ACTIVE
  },
  number_candidates: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  number_applied: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Thiết lập mối quan hệ
Job.belongsTo(Company, { foreignKey: 'company_id' });
Job.belongsTo(Location, { foreignKey: 'location_id' });
Job.belongsTo(Industry, { foreignKey: 'industry_id' });

export default Job;