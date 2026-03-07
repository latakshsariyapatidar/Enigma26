import Location from "../models/locationModel.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/*
CREATE LOCATION (with optional clue & puzzle)
*/
const createLocation = asyncHandler(async (req, res, next) => {
  const {
    name,
    clueText,
    clueHint,
    puzzleText,
    puzzleHint,
    answer
  } = req.body;

  if (!name) {
    return next(new ApiError(400, "Location name is required"));
  }

  // ensure at least one clue exists
  if (!clueText) {
    return next(new ApiError(400, "At least one clue (text/image/audio) is required"));
  }

  // ensure puzzle text + answer exist
  if (!puzzleText || !answer) {
    return next(new ApiError(400, "Puzzle text and answer are required"));
  }

  const location = await Location.create({
    name,
    clue: {
      text: clueText || null,
      image: null,
      audio: null,
      clueHint: clueHint || null,
    },
    puzzle: {
      text: puzzleText || null,
      image: null,
      audio: null,
      puzzleHint: puzzleHint || null,
      answer: answer || null,
    },
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

  return res.status(200).json(
    new ApiResponse(200, locations, "Locations fetched successfully")
  );

});

/*
GET LOCATION BY ID
*/
const getLocationById = asyncHandler(async (req, res, next) => {

  const { locationId } = req.params;

  const location = await Location.findById(locationId);

  if (!location) {
    return next(new ApiError(404, "Location not found"));
  }

  return res.status(200).json(
    new ApiResponse(200, location, "Location fetched successfully")
  );

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

  return res.status(200).json(
    new ApiResponse(200, {}, "Location deleted successfully")
  );

});

export {
  createLocation,
  getAllLocations,
  getLocationById,
  deleteLocation
};