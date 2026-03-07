import express from "express";
import {
  getTeamProgressAdmin,
  getAllTeamProgressAdmin,
} from "../controllers/teamProgressController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

// full progress of one team
router.get("/team/:teamId", verifyJWT, getTeamProgressAdmin); // ! Need to add Is admin middleware here (VERY IMPORTANT)

// leaderboard + dashboard
router.get("/dashboard", verifyJWT, getAllTeamProgressAdmin);

export default router;
