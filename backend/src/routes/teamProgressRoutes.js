import express from "express";
import {
  getTeamProgress,
  getClueHint,
} from "../controllers/teamProgressController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { checkEventActive } from "../middlewares/eventMiddleware.js";

const router = express.Router();

router.get("/progress", verifyJWT, checkEventActive, getTeamProgress);
router.get("/clueHint", verifyJWT, checkEventActive, getClueHint);

export default router;
