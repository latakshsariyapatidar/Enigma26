import mongoose from "mongoose";
import validator from "validator";

const teamProgressSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.ObjectId,
    ref: "Team", // * For populate() function -- we'll use later on if required or can be ignored
    required: [true],
  },
  currentRound: Number,
  currentLocation: {
    type: mongoose.Schema.ObjectId,
    ref: "Location", // * For populate() function -- we'll use later on if required or can be ignored
    required: [true],
  },
  CompletedIn: Date,
  assignedLocations: [
    {
      location: {
        type: mongoose.Schema.ObjectId,
        ref: "Location", // * For populate() function -- we'll use later on if required or can be ignored
        required: [true],
      },
      status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
      },
      clueHintUsed: Boolean,
      puzzlehintUsed: Boolean,
      completedAt: Date,
      score: Number, // * score after every location
      attempts: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const TeamProgress = mongoose.model("TeamProgress", teamProgressSchema);
export default TeamProgress;
