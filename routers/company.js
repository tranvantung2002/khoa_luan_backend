import express from "express";
const router = express.Router();
import { auth, isAdmin, isRecruiter } from "../middleware/auth.js";
import {
  getAllCompany,
  verifyCompany,
  updateCompany,
  createCompany,
  deleteCompany,
  getCompanyByUser,
} from "../controllers/company_controller.js";

router.get("/get-all-companies", getAllCompany);
router.post("/get-company-by-user", getCompanyByUser);
router.post("/verify-company", isAdmin, verifyCompany);
router.post("/create-company", isRecruiter, createCompany);
router.delete("/delete-company", isRecruiter, deleteCompany);
router.post("/update-company", isRecruiter, updateCompany);

export default router;
