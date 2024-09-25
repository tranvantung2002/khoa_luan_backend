import express from "express";
const router = express.Router();
import {
  getProfile,
  updateProfile,
  getUser,
  getUserResume,
  createUserResume,
  deleteUserResume,
  updateUserResume,
} from "../controllers/user_controller.js";
import { auth } from "../middleware/auth.js";

router.get("/user", auth, getUser);
router.post("/get-profile", auth, getProfile);
router.post("/update-profile", auth, updateProfile);
router.post("/get-resume", auth, getUserResume);
router.post("/create-resume", auth, createUserResume);
router.post("/delete-resume", auth, deleteUserResume);
router.post("/update-resume", auth, updateUserResume);
export default router;
