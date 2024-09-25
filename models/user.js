import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Constants from "../utils/constants.js";

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
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(
        Constants.ROLES.USER,
        Constants.ROLES.RECRUITER,
        Constants.ROLES.ADMIN
      ),
      defaultValue: Constants.ROLES.USER,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    profile_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    createdAt: "create_time",
    updatedAt: "modify_time",
    timestamps: true,
  }
);
export default User;
