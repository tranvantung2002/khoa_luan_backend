import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Industry = sequelize.define(
  "Industry",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Industries",
        key: "id",
      },
    },
  },
  {
    tableName: "industries",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Industry.hasMany(Industry, {
  foreignKey: "parent_id",
  as: "subIndustries",
});

Industry.belongsTo(Industry, {
  foreignKey: "parent_id",
  as: "parentIndustry", 
});

export default Industry;
