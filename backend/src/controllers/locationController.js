import Location from "../models/locationModel.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/*
CREATE LOCATION (with clue & puzzle)
  Body expects:
    name        – required
    clueText, clueImage, clueAudio  – at least one required
    clueHint    – optional
    puzzleText, puzzleImage, puzzleAudio – at least one required
    puzzleHint  – optional
    answer      – required
*/
const createLocation = asyncHandler(async (req, res, next) => {
  const {
    name,
    clueText,
    clueImage,
    clueAudio,
    clueHint,
    puzzleText,
    puzzleImage,
    puzzleAudio,
    puzzleHint,
    answer,
  } = req.body;

  if (!name) {
    return next(new ApiError(400, "Location name is required"));
  }

  // At least one clue content field is required
  if (!clueText && !clueImage && !clueAudio) {
    return next(new ApiError(400, "At least one of clueText, clueImage, or clueAudio is required"));
  }

  // At least one puzzle content field is required
  if (!puzzleText && !puzzleImage && !puzzleAudio) {
    return next(new ApiError(400, "At least one of puzzleText, puzzleImage, or puzzleAudio is required"));
  }

  if (!answer) {
    return next(new ApiError(400, "Puzzle answer is required"));
  }

  const location = new Location({
    name,
    clue: {
      text: clueText || undefined,
      image: clueImage || undefined,
      audio: clueAudio || undefined,
      clueHint: clueHint || undefined,
    },
    puzzle: {
      text: puzzleText || undefined,
      image: puzzleImage || undefined,
      audio: puzzleAudio || undefined,
      puzzleHint: puzzleHint || undefined,
      answer,
    },
  });

  await location.save();

  return res.status(201).json(
    new ApiResponse(201, location, "Location created successfully")
  );
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