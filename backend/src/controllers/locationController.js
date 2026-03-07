import Location from "../models/locationModel.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/*
CREATE LOCATION
*/
const createLocation = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new ApiError(400, "Location name is required"));
  }

  const existingLocation = await Location.findOne({ name });

  if (existingLocation) {
    return next(new ApiError(400, "Location already exists"));
  }

  const location = await Location.create({
    name,
    clues: [],
    puzzles: [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, location, "Location created successfully"));
});

/*
GET ALL LOCATIONS
*/
const getAllLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find();

  return res
    .status(200)
    .json(new ApiResponse(200, locations, "Locations fetched successfully"));
});

/*
ADD CLUE AND PUZZLE
Supports text / image / audio
*/
const createClueAndPuzzle = asyncHandler(async (req, res, next) => {
  const { locationId } = req.params;

  const {
    clueType,
    clue,
    clueHint,
    puzzleType,
    puzzle,
    puzzleHint,
    answer,
    slug,
  } = req.body;

  const location = await Location.findById(locationId);

  if (!location) {
    return next(new ApiError(404, "Location not found"));
  }

  let clueContent = clue;
  if (clueType !== "text" && req.file) {
    clueContent = req.file.path;
  }

  let puzzleContent = puzzle;
  if (puzzleType !== "text" && req.file) {
    puzzleContent = req.file.path;
  }

  if (clueType) {
    location.clues.push({
      type: clueType,
      clue: clueContent,
      clueHint,
    });
  }

  if (puzzleType) {
    location.puzzles.push({
      type: puzzleType,
      puzzle: puzzleContent,
      puzzleHint,
      answer,
      slug,
    });
  }

  await location.save();

  return res
    .status(200)
    .json(new ApiResponse(200, location, "Clue and puzzle added successfully"));
});

/*
UPDATE CLUES OR PUZZLES
*/
// const updateClueAndPuzzle = asyncHandler(async (req, res, next) => {
//   const { locationId } = req.params;

//   const location = await Location.findById(locationId);

//   if (!location) {
//     return next(new ApiError(404, "Location not found"));
//   }

//   if (req.body.clues) {
//     location.clues = req.body.clues;
//   }

//   if (req.body.puzzles) {
//     location.puzzles = req.body.puzzles;
//   }

//   await location.save();

//   return res
//     .status(200)
//     .json(new ApiResponse(200, location, "Location updated successfully"));
// });

/*
DELETE LOCATION
*/
const deleteLocation = asyncHandler(async (req, res, next) => {
  const { locationId } = req.params;

  const location = await Location.findById(locationId);

  if (!location) {
    return next(new ApiError(404, "Location not found"));
  }

  await Location.findByIdAndDelete(locationId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Location deleted successfully"));
});

export {
  createLocation,
  getAllLocations,
  createClueAndPuzzle,
  updateClueAndPuzzle,
  deleteLocation,
};