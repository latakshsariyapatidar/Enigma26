import express from "express";

import {
  createLocation,
  getAllLocations,
  createClueAndPuzzle,
  updateClueAndPuzzle,
  deleteLocation,
} from "../controllers/locationController.js";

const router = express.Router();

router.post("/create-location", createLocation);

router.get("/get-locations", getAllLocations);

router.post("/add-clue-puzzle/:locationId", createClueAndPuzzle);

router.put("/update-location/:locationId", updateClueAndPuzzle);

router.delete("/delete-location/:locationId", deleteLocation);

export default router;