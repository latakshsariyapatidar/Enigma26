import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name!"],
    unique: true,
  },

  clue: {
    text: String,
    image: String, // cloudinary URL if necessary
    audio: String, // cloudinary URL if necessary
    clueHint: String,
  },

  puzzle: {
    text: String,
    image: String,
    audio: String,
    puzzleHint: String,
    answer: String,
  },

  // ! Add QR -- PlaceHolder
});

const Location = mongoose.model("Location", locationSchema);
export default Location;
