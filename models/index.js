import sequelize from "../config/db.js";
import User from "./user.js";
import Role from "./role.js";
import UserRole from "./user_role.js";
import Company from "./company.js";
import CompanyUser from "./company_user.js";
import Location from "./location.js";
import Industry from "./industry.js";
import Job from "./job.js";
import JobApplication from "./job_application.js";
import Resume from "./resume.js";

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

export {
  User,
  Role,
  UserRole,
  Company,
  CompanyUser,
  Location,
  Job,
  Industry,
  JobApplication,
  Resume
};
