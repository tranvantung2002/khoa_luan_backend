import express from "express";
const router = express.Router();
import { uploadFile } from "../controllers/upload_controller.js";


router.post("/upload", uploadFile);
export default router;