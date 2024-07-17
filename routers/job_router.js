import express from "express";
const router = express.Router();
import { isAdmin, isRecruiter } from "../middleware/auth.js";

import {
  getAllJobs,
  createJob,
  deleteJob,
  updateJob,
  applyForJob,
  getAllJobsByRecruiter,
  getCandidateByJob,
  updateJobApplication
} from "../controllers/job_controller.js";

router.get("/get-all-jobs", getAllJobs);
router.post("/create-job", isRecruiter, createJob);
router.delete("/delete-job", isRecruiter, deleteJob);
router.post("/update-job", isRecruiter, updateJob);

router.post("/apply-for-job", applyForJob);
router.get("/get-jobs-byrecruiter", isRecruiter, getAllJobsByRecruiter);
router.post("/update-job-application", isRecruiter, updateJobApplication);
export default router;
