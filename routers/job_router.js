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
router.post("/delete-job", isRecruiter, deleteJob);
router.post("/update-job", isRecruiter, updateJob);

router.post("/apply-for-job", applyForJob);
router.post("/get-jobs-byrecruiter", getAllJobsByRecruiter);
router.post("/update-job-application", isRecruiter, updateJobApplication);
router.post("/get-candidate-by-job", getCandidateByJob)
export default router;
