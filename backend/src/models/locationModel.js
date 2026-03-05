import mongoose from "mongoose";
import validator from "validator";

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name!"],
    unique: true,
  },
  clue: [
    {
      clue: String,
      clueHint: String,
    },
  ],
  puzzle: [
    {
      puzzle: String,
      slug: String,
      puzzleHint: String,
      puzzleAnswer: String,
    },
  ],
  // ! Add QR -- PlaceHolder
});

const Location = mongoose.model("Location", locationSchema);
export default Location;
