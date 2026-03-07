import express from "express";
import {
  getTeamProgress,
  getClueHint,
  getPuzzle,
  getPuzzleHint,
  submitAnswer,
} from "../controllers/teamProgressController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/progress", verifyJWT, getTeamProgress);
router.get("/clueHint", verifyJWT, getClueHint);
router.get("/puzzle", verifyJWT, getPuzzle);
router.get("/puzzleHint", verifyJWT, getPuzzleHint);
router.post("/submitAnswer", verifyJWT, submitAnswer);

export default router;
