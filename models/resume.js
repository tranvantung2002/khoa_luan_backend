import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

import User from "./user.js";

const Resume = sequelize.define(
  "Resume",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    resume_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    resume_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "resumes",
    createdAt: "create_time",
    updatedAt: "modify_time",
    timestamps: true,
  }
);

export default Resume;
