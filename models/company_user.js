import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js'; // Đảm bảo rằng bạn đã tạo mô hình User
import Company from './company.js';

const CompanyUser = sequelize.define('CompanyUser', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    primaryKey: true,
  },
  company_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Company,
      key: 'id',
    },
    primaryKey: true,
  },
}, {
  tableName: 'company_users',
  timestamps: false,
});

User.belongsToMany(Company, { through: CompanyUser, foreignKey: 'user_id' });
Company.belongsToMany(User, { through: CompanyUser, foreignKey: 'company_id' });

export default CompanyUser;