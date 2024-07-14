import sequelize from "../config/db.js";
import User from "./user.js";
import Role from "./role.js";
import UserRole from "./user_role.js";
import Profile from "./profile.js";

// Thiết lập mối quan hệ nhiều-nhiều
User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });

User.hasOne(Profile, {
  foreignKey: "user_id",
  onDelete: "CASCADE", // Xóa hồ sơ nếu người dùng bị xóa
  onUpdate: "CASCADE", // Cập nhật hồ sơ nếu id người dùng bị cập nhật
});

Profile.belongsTo(User, {
  foreignKey: "user_id",
});
const initializeModels = async () => {
  try {
    // Đồng bộ hóa các mô hình với cơ sở dữ liệu
    await sequelize.sync({ alter: false });
    console.log("Models have been synchronized and relationships established");
  } catch (error) {
    console.error("Error initializing models:", error);
  }
};

initializeModels();

export { User, Role, UserRole, Profile };
