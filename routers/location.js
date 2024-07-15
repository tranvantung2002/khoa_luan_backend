import express from "express";
const router = express.Router();
import {  isAdmin, isRecruiter } from "../middleware/auth.js";

import { getAllLocation,createLocation,deleteLocation,updateLocation } from "../controllers/location_controller.js";

router.get("/get-all-locations", getAllLocation);
router.post("/create-location", isAdmin, createLocation);
router.delete("/delete-location", isAdmin, deleteLocation);
router.post("/update-location", isAdmin, updateLocation);

export default router;