import Location from "../models/locationModel.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/*
CREATE LOCATION (with clue & puzzle)
  Body (form-data):
    name        – required (text)
    clueText    – optional (text)
    clueHint    – optional (text)
    puzzleText  – optional (text)
    puzzleHint  – optional (text)
    answer      – required (text)
  Files:
    clueImage   – optional (file)
    clueAudio   – optional (file)
    puzzleImage – optional (file)
    puzzleAudio – optional (file)
  At least one of clueText/clueImage/clueAudio is required.
  At least one of puzzleText/puzzleImage/puzzleAudio is required.
*/
const createLocation = asyncHandler(async (req, res, next) => {
  const { name, clueText, clueHint, puzzleText, puzzleHint, answer } = req.body;

  if (!name) {
    return next(new ApiError(400, "Location name is required"));
  }

  // Upload files to Cloudinary if provided
  const clueImageFile = req.files?.clueImage?.[0]?.path;
  const clueAudioFile = req.files?.clueAudio?.[0]?.path;
  const puzzleImageFile = req.files?.puzzleImage?.[0]?.path;
  const puzzleAudioFile = req.files?.puzzleAudio?.[0]?.path;

  const clueImageUrl = clueImageFile ? (await uploadOnCloudinary(clueImageFile))?.url : undefined;
  const clueAudioUrl = clueAudioFile ? (await uploadOnCloudinary(clueAudioFile))?.url : undefined;
  const puzzleImageUrl = puzzleImageFile ? (await uploadOnCloudinary(puzzleImageFile))?.url : undefined;
  const puzzleAudioUrl = puzzleAudioFile ? (await uploadOnCloudinary(puzzleAudioFile))?.url : undefined;

  // At least one clue content field is required
  if (!clueText && !clueImageUrl && !clueAudioUrl) {
    return next(new ApiError(400, "At least one of clueText, clueImage, or clueAudio is required"));
  }

  // At least one puzzle content field is required
  if (!puzzleText && !puzzleImageUrl && !puzzleAudioUrl) {
    return next(new ApiError(400, "At least one of puzzleText, puzzleImage, or puzzleAudio is required"));
  }

  if (!answer) {
    return next(new ApiError(400, "Puzzle answer is required"));
  }

  const location = new Location({
    name,
    clue: {
      text: clueText || undefined,
      image: clueImageUrl || undefined,
      audio: clueAudioUrl || undefined,
      clueHint: clueHint || undefined,
    },
    puzzle: {
      text: puzzleText || undefined,
      image: puzzleImageUrl || undefined,
      audio: puzzleAudioUrl || undefined,
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