import express from "express";
const router = express.Router();
import {  isAdmin, isRecruiter } from "../middleware/auth.js";

import { getAllJobs,createJob,deleteJob,updateJob ,applyForJob} from "../controllers/job_controller.js";

router.get("/get-all-jobs", getAllJobs);
router.post("/create-job", isRecruiter, createJob);
router.delete("/delete-job", isRecruiter, deleteJob);
router.post("/update-job", isRecruiter, updateJob);

router.post("/apply-for-job",applyForJob)

export default router;