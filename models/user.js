import { DataTypes } from "sequelize";
import sequelize from '../config/db.js';

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
  },
  {
    tableName: 'users',
    createdAt: 'create_time',
    updatedAt: 'modify_time',
    timestamps: true,
  }
);
export default User;
