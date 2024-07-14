import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Company = sequelize.define(
  "Company",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    image_url: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
    code_tax: {
      type: DataTypes.STRING(255),
      unique: true, 
      allowNull: true,
    },
  },
  {
    tableName: "companies",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "modify_time",
  }
);

export default Company;
