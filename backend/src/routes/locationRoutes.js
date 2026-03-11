import express from "express";

import {
  createLocation,
  getAllLocations,
  getLocationById,
  deleteLocation,
} from "../controllers/locationController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/validationMiddleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();
router.use(verifyJWT);
router.post("/create-location", isAdmin, upload.fields([
  { name: "clueImage", maxCount: 1 },
  { name: "clueAudio", maxCount: 1 },
  { name: "puzzleImage", maxCount: 1 },
  { name: "puzzleAudio", maxCount: 1 },
]), createLocation);

router.get("/get-locations",isAdmin, getAllLocations);

router.get("/get-location/:locationId", getLocationById);


router.delete("/delete-location/:locationId",isAdmin, deleteLocation);

export default router;