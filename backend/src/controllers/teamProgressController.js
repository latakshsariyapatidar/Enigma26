import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import TeamProgress from "../models/teamProgressModel.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Location from "../models/locationModel.js";
import { numberOfRounds } from "../utils/constant.js";
import Team from "../models/teamModel.js";

// // Participant Routes ---------------------------------------------
export const getTeamProgress = asyncHandler(async (req, res, next) => {
  const progress = await TeamProgress.findOne({
    teamId: req.user._id,
  });

  if (!progress) {
    return next(new ApiError(404, "Team progress not found"));
  }

  if (progress.currentRound > numberOfRounds) {
    return res.status(200).json(new ApiResponse(200, null, "Event Completed"));
  }

  const location = await Location.findById(progress.currentLocation);
  if (!location) {
    return next(new ApiError(404, "Location not found"));
  }

  const scoreIndex = Math.min(progress.currentRound - 1, numberOfRounds - 1);
  const totalScore = progress.assignedLocations[scoreIndex]?.score || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        teamId: progress.teamId,
        currentRound: progress.currentRound,
        currentLocation: location?.name,
        score: totalScore,
        clue: location.clue,
      },
      "Team progress fetched successfully along with current location's clue "
    )
  );
});

// export const getClue = asyncHandler(async (req, res, next) => {
//   const progress = await TeamProgress.findOne({
//     teamId: req.user._id,
//   });

//   if (!progress) {
//     return next(new ApiError(404, "Team progress not found"));
//   }

//   const location = await Location.findById(progress.currentLocation);

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {

//       },
//       "Clue fetched successfully"
//     )
//   );
// });

export const getClueHint = asyncHandler(async (req, res, next) => {
  const progress = await TeamProgress.findOne({
    teamId: req.user._id,
  });

  if (!progress) {
    return next(new ApiError(404, "Team progress not found"));
  }

  const location = await Location.findById(progress.currentLocation);

  if (!location) {
    return next(new ApiError(404, "Location not found"));
  }
  if (!location.clue.clueHint) {
    return next(new ApiError(404, "Clue-hint not available"));
  }

  const current = progress.assignedLocations[progress.currentRound - 1];
  if (!current) {
    return next(new ApiError(400, "Invalid round state"));
  }

  if (!current.clueHintUsed) {
    current.clueHintUsed = true;
    current.score = (current.score ?? 0) - 5;
    await progress.save();
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { clueHint: location.clue.clueHint },
        "Clue hint fetched successfully"
      )
    );
});

// export const getPuzzle = asyncHandler(async (req, res, next) => {
//   const progress = await TeamProgress.findOne({
//     teamId: req.user._id,
//   });

//   if (!progress) {
//     return next(new ApiError(404, "Team progress not found"));
//   }

//   const location = await Location.findById(progress.currentLocation);

//   if (!location) {
//     return next(new ApiError(404, "Location not found"));
//   }

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         puzzle: location.puzzle.puzzle,
//         type: location.puzzle.type,
//       },
//       "Puzzle fetched successfully"
//     )
//   );
// });

// export const getPuzzleHint = asyncHandler(async (req, res, next) => {
//   const progress = await TeamProgress.findOne({
//     teamId: req.user._id,
//   });

//   if (!progress) {
//     return next(new ApiError(404, "Team progress not found"));
//   }

//   const location = await Location.findById(progress.currentLocation);

//   if (!location) {
//     return next(new ApiError(404, "Location not found"));
//   }

//   if (!location.puzzle.puzzleHint) {
//     return next(new ApiError(404, "Puzzle-hint not available"));
//   }

//   const current = progress.assignedLocations[progress.currentRound - 1];
//   if (!current) {
//     return next(new ApiError(400, "Invalid round state"));
//   }

//   if (!current.puzzlehintUsed) {
//     current.puzzlehintUsed = true;
//     current.score = (current.score ?? 0) - 5;
//     await progress.save();
//   }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         { puzzleHint: location.puzzle.puzzleHint },
//         "Puzzle hint fetched successfully"
//       )
//     );
// });

// // ! To edit - NEEDS MORE WORK -- Score updation, currentRound updation,
// // ! next location assignment, team progress updation after every submission etc.
// // ! -- Will be done after the basic flow is ready and tested
// export const submitAnswer = asyncHandler(async (req, res, next) => {
//   const { answer } = req.body;

//   if (!answer) {
//     return next(new ApiError(400, "Answer is required"));
//   }

//   const progress = await TeamProgress.findOne({
//     teamId: req.user._id,
//   });

//   if (!progress) {
//     return next(new ApiError(404, "Team progress not found"));
//   }

//   const location = await Location.findById(progress.currentLocation);

//   if (!location) {
//     return next(new ApiError(404, "Location not found"));
//   }

//   const current = progress.assignedLocations[progress.currentRound - 1];

//   if (!current) {
//     return next(new ApiError(400, "Invalid round state"));
//   }

//   current.attempts = (current.attempts || 0) + 1;

//   if (answer.toLowerCase().trim() !== location.puzzle.answer.toLowerCase()) {
//     await progress.save();

//     return res
//       .status(400)
//       .json(
//         new ApiResponse(400, { attempts: current.attempts }, "Wrong answer")
//       );
//   }

//   // mark location completed
//   current.status = "completed";
//   current.completedAt = new Date();

//   await progress.save();

//   return res.status(200).json(new ApiResponse(200, null, "Correct answer"));
// });

// // Admin-Routes ---------------------------------------------

export const getTeamProgressAdmin = asyncHandler(async (req, res, next) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId);

  if (!team || team.role !== "participant") {
    return next(new ApiError(404, "Participant team not found"));
  }

  const progress = await TeamProgress.findOne({ teamId });

  if (!progress) {
    return next(new ApiError(404, "Team progress not found"));
  }

  const roundLogs = [];
  const route = [];

  for (let i = 0; i < progress.assignedLocations.length; i++) {
    const item = progress.assignedLocations[i];

    const location = await Location.findById(item.location).select("name");

    if (!location) {
      return next(new ApiError(404, "Location not found"));
    }

    route.push({
      locationId: location._id,
      name: location.name,
      status: item.status,
    });

    if (item.status === "completed") {
      roundLogs.push({
        round: i + 1,
        location: location.name,
        attempts: item.attempts || 0,
        hintsUsed: (item.puzzlehintUsed ? 1 : 0) + (item.clueHintUsed ? 1 : 0),
        time: item.completedAt,
        scoreAfter: item.score,
      });
    }
  }

  const scoreIndex = Math.min(progress.currentRound - 1, numberOfRounds - 1);
  const totalScore = progress.assignedLocations[scoreIndex]?.score || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: {
          teamId: progress.teamId,
          currentRound: progress.currentRound,
          totalScore,
          totalTime: progress.CompletedIn,
        },
        roundLogs,
        route,
      },
      "Team progress fetched successfully"
    )
  );
});

// * AllTeamProgress sorted for leaderboard purposes

export const getAllTeamProgressAdmin = asyncHandler(async (req, res, next) => {
  const participants = await Team.find({ role: "participant" }).select("_id");

  const participantIds = participants.map((team) => team._id);

  const allProgress = await TeamProgress.find({
    teamId: { $in: participantIds },
  });

  if (allProgress.length === 0) {
    return next(new ApiError(404, "No team progress found"));
  }

  const leaderboard = [];
  const hintUsage = [];

  let finishedTeams = 0;

  for (const team of allProgress) {
    const scoreIndex = Math.min(team.currentRound - 1, numberOfRounds - 1);
    const totalScore = team.assignedLocations[scoreIndex]?.score || 0;

    const totalHints = team.assignedLocations.reduce(
      (sum, loc) =>
        sum + (loc.clueHintUsed ? 1 : 0) + (loc.puzzlehintUsed ? 1 : 0),
      0
    );

    const status =
      team.currentRound > team.assignedLocations.length ? "Done" : "Active";

    if (status === "Done") finishedTeams++;

    const displayRound = Math.min(
      team.currentRound,
      team.assignedLocations.length
    );

    leaderboard.push({
      teamId: team.teamId,
      round: `${displayRound}/${team.assignedLocations.length}`,
      score: totalScore,
      hints: totalHints,
      time: team.CompletedIn,
      status,
    });

    hintUsage.push({
      teamId: team.teamId,
      hints: totalHints,
    });
  }

  // sorting rule: rounds ↓ → score ↓ → time ↑
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;

    if (a.time !== b.time) return a.time - b.time;

    const roundA = parseInt(a.round.split("/")[0]);
    const roundB = parseInt(b.round.split("/")[0]);

    return roundB - roundA;
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: {
          totalTeams: allProgress.length,
          finishedTeams,
        },
        leaderboard,
        hintUsage,
      },
      "Admin dashboard data fetched successfully"
    )
  );
});
