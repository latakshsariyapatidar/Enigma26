import express from "express";

import {
  createLocation,
  getAllLocations,
  getLocationById,
  deleteLocation,
} from "../controllers/locationController.js";

import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ADMIN ONLY
router.post("/create-location", verifyJWT, createLocation);
router.delete("/delete-location/:locationId", verifyJWT, deleteLocation);

// PUBLIC ROUTES
router.get("/get-locations", getAllLocations);
router.get("/get-location/:locationId", getLocationById);

export default router;