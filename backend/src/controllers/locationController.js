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
    clueType,
    clue,
    clueHint,
    puzzleType,
    puzzle,
    puzzleHint,
    answer,
    slug
  } = req.body;

  if (!name) {
    return next(new ApiError(400, "Location name is required"));
  }

  const location = new Location({
    name,
    clues: [],
    puzzles: []
  });

  if (clueType) {
    let clueContent = clue;

    if (clueType !== "text" && req.file) {
      clueContent = req.file.path;
    }

    location.clues.push({
      type: clueType,
      clue: clueContent,
      clueHint
    });
  }

  if (puzzleType) {
    let puzzleContent = puzzle;

    if (puzzleType !== "text" && req.file) {
      puzzleContent = req.file.path;
    }

    location.puzzles.push({
      type: puzzleType,
      puzzle: puzzleContent,
      puzzleHint,
      answer,
      slug
    });
  }

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