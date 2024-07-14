import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

import User from './user.js';

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  user_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  profile_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  
}, {
    tableName: 'profiles',
    createdAt: 'create_time',
    updatedAt: 'modify_time',
    timestamps: true,
});

export default Profile;