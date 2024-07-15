import express from "express";
const router = express.Router();
import {  isAdmin, isRecruiter } from "../middleware/auth.js";

import { createIndustry,deleteIndustry,getAllIndustries,updateIndustry } from "../controllers/industry_controller.js";

router.get("/get-all-industries", getAllIndustries);
router.post("/create-industry", isAdmin, createIndustry);
router.delete("/delete-industry", isAdmin, deleteIndustry);
router.post("/update-industry", isAdmin, updateIndustry);

export default router;