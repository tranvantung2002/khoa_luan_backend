import express from "express";
const router = express.Router();
import { auth, isAdmin, isRecruiter } from "../middleware/auth.js";
import {
  getAllCompany,
  verifyCompany,
  updateCompany,
  createCompany,
  deleteCompany,
} from "../controllers/company_controller.js";

router.get("/get-all-companies", getAllCompany);
router.post("/verify-company", isAdmin, verifyCompany);
router.post("/create-company", isAdmin, createCompany);
router.delete("/delete-company", isAdmin, deleteCompany);

router.post("/update-company", isRecruiter, updateCompany);

export default router;
