import mongoose from "mongoose";

const clueSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "image", "audio"],
    required: true,
  },

  clue: {
    type: String, // Text or cloudinary-url
    required: true,
  },

  clueHint: String,
});

const puzzleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "image", "audio"],
    required: true,
  },

  puzzle: {
    type: String, // Text or cloudinary-url
    required: true,
  },

  slug: String,

  puzzleHint: String,

  answer: String,
});

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name!"],
    unique: true,
  },

  clues: [clueSchema],

  puzzles: [puzzleSchema],

  // ! Add QR -- PlaceHolder
});

const Location = mongoose.model("Location", locationSchema);
export default Location;
