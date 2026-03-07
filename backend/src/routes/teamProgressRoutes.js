import express from "express";
import {
  getTeamProgress,
  getClueHint,
} from "../controllers/teamProgressController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/progress", verifyJWT, getTeamProgress);
router.get("/clueHint", verifyJWT, getClueHint);

export default router;
