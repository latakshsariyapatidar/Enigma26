import mongoose from "mongoose";
import validator from "validator";
import { numberOfRounds } from "../constant.js";
const teamProgressSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.ObjectId,
    ref: "Team", // * For populate() function -- we'll use later on if required or can be ignored
    required: [true],
  },
  currentRound: {
    type:Number,
    default:1
  },
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
      clueHintUsed:{
        type:Boolean,
        default:false
      },
      puzzlehintUsed:{
        type:Boolean,
        default:false
      },
      completedAt: Date,
      score:{
        type:Number,
        default:0
      }, // * score after every location
      qrcodeseen:{
        type:Boolean,
        default:false
      },
      attempts: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const TeamProgress = mongoose.model("TeamProgress", teamProgressSchema);
export default TeamProgress;
