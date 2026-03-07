import express from "express";

import {
  createLocation,
  getAllLocations,
  getLocationById,
  deleteLocation,
} from "../controllers/locationController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/validationMiddleware.js";

const router = express.Router();
router.use(verifyJWT);
router.post("/create-location",isAdmin, createLocation);

router.get("/get-locations",isAdmin, getAllLocations);

router.get("/get-location/:locationId", getLocationById);


router.delete("/delete-location/:locationId",isAdmin, deleteLocation);

export default router;