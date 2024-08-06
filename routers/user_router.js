import express from "express";
const router = express.Router();
import { getProfile } from "../controllers/user_controller.js";
import { auth } from "../middleware/auth.js";

router.post("/get-profile", auth, getProfile);

export default router;
