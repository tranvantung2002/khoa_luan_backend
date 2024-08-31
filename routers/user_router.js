import express from "express";
const router = express.Router();
import { getProfile, updateProfile } from "../controllers/user_controller.js";
import { auth } from "../middleware/auth.js";

router.post("/get-profile", auth, getProfile);
router.post("/update-profile", auth, updateProfile);
export default router;
