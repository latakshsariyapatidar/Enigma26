import express from "express";

import {
  createLocation,
  getAllLocations,
  getLocationById,
  deleteLocation,
} from "../controllers/locationController.js";

const router = express.Router();

router.post("/create-location", createLocation);

router.get("/get-locations", getAllLocations);

router.get("/get-location/:locationId", getLocationById);

// router.put("/update-location/:locationId", updateClueAndPuzzle);

router.delete("/delete-location/:locationId", deleteLocation);

export default router;