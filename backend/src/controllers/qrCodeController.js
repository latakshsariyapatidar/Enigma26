import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import TeamProgress from "../models/teamProgressModel.js";
import Location from "../models/locationModel.js";
import { numberOfRounds } from "../constant.js";

const checkQrLocation = asyncHandler(async (req, res, next) => {
  const { locId } = req.params;
  //fetch the location from the teamprogress
  const teamProgress = await TeamProgress.findOne({
    teamId: req.user._id,
    currentLocation: locId,
  });
  if (!teamProgress) {
    return next(new ApiError(404, "Your are not at the correct location"));
  }

  // Block QR scan only if still at base camp (puzzle not solved yet)
  if (teamProgress.currentRound === 0) {
    const baseCampLocId = teamProgress.assignedLocations[teamProgress.assignedLocations.length - 1].location.toString();
    if (locId === baseCampLocId) {
      return next(
        new ApiError(
          400,
          "Solve the base camp puzzle first before scanning QR codes."
        )
      );
    }
  }
  const location = await Location.findById(locId);
  if (!location) {
    return next(new ApiError(404, "Location not found"));
  }

  // Handle edge case: team already at final round from old data — complete the game
  if (teamProgress.currentRound >= numberOfRounds) {
    const currentLoc = teamProgress.assignedLocations.find(
      (loc) => loc.location.toString() === locId
    );
    if (currentLoc && currentLoc.status !== "completed") {
      currentLoc.status = "completed";
      currentLoc.completedAt = new Date();
      currentLoc.qrcodeseen = true;
      currentLoc.score += 10;
    }
    teamProgress.currentRound = numberOfRounds + 1;
    teamProgress.currentLocation = null;
    teamProgress.CompletedIn = new Date();
    await teamProgress.save();
    return res.status(200).json(new ApiResponse(200, { gameCompleted: true }, "Hunt Complete!"));
  }

  if (
    !teamProgress.assignedLocations.find(
      (location) => location.location.toString() === locId
    ).qrcodeseen
  ) {
    teamProgress.assignedLocations.find(
      (location) => location.location.toString() === locId
    ).qrcodeseen = true;
    
    // Increment round on QR scan
    teamProgress.currentRound += 1;
    teamProgress.assignedLocations[teamProgress.currentRound - 1].score += 10;
    
    // Check if this is the final QR scan (returning to base camp) — game complete
    if (teamProgress.currentRound >= numberOfRounds) {
      teamProgress.assignedLocations[teamProgress.currentRound - 1].status = "completed";
      teamProgress.assignedLocations[teamProgress.currentRound - 1].completedAt = new Date();
      teamProgress.currentRound = numberOfRounds + 1;
      teamProgress.currentLocation = null;
      teamProgress.CompletedIn = new Date();
      await teamProgress.save();
      return res.status(200).json(new ApiResponse(200, { gameCompleted: true }, "Hunt Complete!"));
    }
    
    await teamProgress.save();
  }

  const hintTaken = teamProgress.assignedLocations.find(
    (location) => location.location.toString() === locId
  ).puzzlehintUsed;
  const response = {
    text: location.puzzle.text,
    image: location.puzzle.image,
    audio: location.puzzle.audio,
    hint: hintTaken ? location.puzzle.puzzleHint : "",
  };
  return res.status(200).json(new ApiResponse(200, response, "Location found"));
});
const checkPuzzleAnswer = asyncHandler(async (req, res, next) => {
  const { locId } = req.params;
  const { answer } = req.body;
  if (!answer) {
    return next(new ApiError(400, "answer is required"));
  }
  const teamProgress = await TeamProgress.findOne({
    teamId: req.user._id,
    currentLocation: locId,
  });
  if (!teamProgress) {
    return next(new ApiError(404, "Your are not at the correct location"));
  }
  const location = await Location.findById(locId);
  if (!location) {
    return next(new ApiError(404, "Location not found"));
  }
  const current = teamProgress.assignedLocations.find(
    (location) => location.location.toString() === locId
  );
  if (current.status === "completed") {
    // If they already scanned the QR for Round 8, it's marked completed.
    // They shouldn't be able to submit a puzzle answer for it.
    return next(new ApiError(400, "This round is already completed"));
  }
  
  if (teamProgress.currentRound > numberOfRounds) {
     return next(new ApiError(400, "Event is already completed"));
  }
  
  current.attempts += 1;
  if (answer.toLowerCase() !== location.puzzle.answer.toLowerCase()) {
    await teamProgress.save();
    return next(new ApiError(400, "Incorrect answer"));
  }
  //answer was correct
  if (teamProgress.currentRound === 0) {
    // Base camp puzzle solved: don't increment round, just move to first location
    teamProgress.currentLocation = teamProgress.assignedLocations[0].location;
    await teamProgress.save();
    return res.status(200).json(
      new ApiResponse(200, {}, "Correct answer you can proceed to the first location")
    );
  }

  teamProgress.assignedLocations.find(
    (location) => location.location.toString() === locId
  ).status = "completed";
  teamProgress.assignedLocations.find(
    (location) => location.location.toString() === locId
  ).completedAt = new Date();
  //score logic
  teamProgress.assignedLocations[teamProgress.currentRound - 1].score += 10;

  if (teamProgress.currentRound >= numberOfRounds) {
    // Last puzzle solved — game complete
    teamProgress.currentRound += 1;
    teamProgress.currentLocation = null;
    teamProgress.CompletedIn = new Date();
  } else {
    // Move to next location (don't increment round, QR scan will do that)
    teamProgress.assignedLocations[teamProgress.currentRound].score +=
      teamProgress.assignedLocations[teamProgress.currentRound - 1].score;
    teamProgress.currentLocation =
      teamProgress.assignedLocations[teamProgress.currentRound].location;
  }
  await teamProgress.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Correct answer you can proceed to next round")
    );
});

const getPuzzleHint = asyncHandler(async (req, res, next) => {
  const { locId } = req.params;
  const teamProgress = await TeamProgress.findOne({
    teamId: req.user._id,
    currentLocation: locId,
  });
  if (!teamProgress) {
    return next(new ApiError(404, "Your are not at the correct location"));
  }
  const location = await Location.findById(locId);
  if (!location) {
    return next(new ApiError(404, "Location not found"));
  }
  const current = teamProgress.assignedLocations.find(
    (location) => location.location.toString() === locId
  );
  if (!current) {
    return next(new ApiError(400, "Invalid round state"));
  }
  
  if (teamProgress.currentRound > numberOfRounds) {
     return next(new ApiError(400, "Event is already completed"));
  }
  
  if (!current.puzzlehintUsed) {
    current.puzzlehintUsed = true;
    current.score -= 5;
    await teamProgress.save();
  }
  const response = {
    puzzleHint: location.puzzle.puzzleHint,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, response, "Puzzle hint fetched successfully"));
});

const giveUpPuzzle = asyncHandler(async (req, res, next) => {
  const { locId } = req.params;
  const teamProgress = await TeamProgress.findOne({
    teamId: req.user._id,
    currentLocation: locId,
  });
  if (!teamProgress) {
    return next(new ApiError(404, "Your are not at the correct location"));
  }
  const location = await Location.findById(locId);
  if (!location) {
    return next(new ApiError(404, "Location not found"));
  }
  const current = teamProgress.assignedLocations.find(
    (location) => location.location.toString() === locId
  );
  if (!current) {
    return next(new ApiError(400, "Invalid round state"));
  }
  if (current.status === "completed") {
    return next(new ApiError(400, "This round is already completed"));
  }
  if (teamProgress.currentRound > numberOfRounds) {
     return next(new ApiError(400, "Event is already completed"));
  }
  if (teamProgress.currentRound === 0) {
    // Base camp give up: don't increment round, just move to first location
    current.score -= 5;
    teamProgress.currentLocation = teamProgress.assignedLocations[0].location;
    teamProgress.assignedLocations[0].score += current.score;
    await teamProgress.save();
    return res.status(200).json(
      new ApiResponse(
        200,
        { puzzleAnswer: location.puzzle.answer.toLowerCase() },
        "Puzzle given up successfully"
      )
    );
  }
  
  current.status = "completed";
  current.completedAt = new Date();
  current.score -= 5;
  
  if (teamProgress.currentRound >= numberOfRounds) {
    // Last puzzle given up — game complete
    teamProgress.currentRound += 1;
    teamProgress.currentLocation = null;
    teamProgress.CompletedIn = new Date();
  } else {
    // Move to next location (don't increment round, QR scan will do that)
    teamProgress.assignedLocations[teamProgress.currentRound].score +=
      teamProgress.assignedLocations[teamProgress.currentRound - 1].score;
    teamProgress.currentLocation =
      teamProgress.assignedLocations[teamProgress.currentRound].location;
  }
  await teamProgress.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { puzzleAnswer: location.puzzle.answer.toLowerCase() },
        "Puzzle given up successfully"
      )
    );
});

export { checkQrLocation, checkPuzzleAnswer, getPuzzleHint, giveUpPuzzle };
