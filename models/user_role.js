import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from './user.js'; 
import Role from './role.js'
const UserRole = sequelize.define(
  "UserRole",
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User, 
        key: "id",
      },
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Role, 
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    timestamps: false, 
    primaryKey: false, 
    tableName: "user_roles",
    createdAt: "create_time",
    updatedAt: "modify_time",
  }
);
// Thiết lập mối quan hệ nhiều-nhiều
User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });

export default UserRole;
