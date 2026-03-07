import Location from "../models/locationModel.js";

/*
CREATE LOCATION
Admin creates a new location
*/
export const createLocation = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Location name is required",
      });
    }

    const existingLocation = await Location.findOne({ name });

    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: "Location already exists",
      });
    }

    const location = await Location.create({
      name,
      clues: [],
      puzzles: [],
    });

    res.status(201).json({
      success: true,
      location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
GET ALL LOCATIONS
Used by admin dashboard
*/
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();

    res.status(200).json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
ADD CLUE AND PUZZLE
Supports text / image / audio
If image/audio → multer provides req.file.path
*/
export const createClueAndPuzzle = async (req, res) => {
  try {
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
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    // Determine clue content
    let clueContent = clue;
    if (clueType !== "text" && req.file) {
      clueContent = req.file.path;
    }

    // Determine puzzle content
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

    res.status(200).json({
      success: true,
      location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
UPDATE CLUES OR PUZZLES
*/
export const updateClueAndPuzzle = async (req, res) => {
  try {
    const { locationId } = req.params;

    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    if (req.body.clues) {
      location.clues = req.body.clues;
    }

    if (req.body.puzzles) {
      location.puzzles = req.body.puzzles;
    }

    await location.save();

    res.status(200).json({
      success: true,
      location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
DELETE LOCATION
*/
export const deleteLocation = async (req, res) => {
  try {
    const { locationId } = req.params;

    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    await Location.findByIdAndDelete(locationId);

    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};