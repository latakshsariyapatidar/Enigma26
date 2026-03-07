import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";
import TeamProgress from "../models/teamProgressModel.js";
import Location from "../models/locationModel.js";
import { numberOfRounds } from "../constant.js";

const checkQrLocation = asyncHandler(async (req, res, next) => {
    const {locId} = req.params;
    //fetch the location from the teamprogress
    const teamProgress = await TeamProgress.findOne({teamId: req.user._id,currentLocation: locId});
    if (!teamProgress) {
        return next( new ApiError(404, "Your are not at the correct location"));
    }
    const location = await Location.findById(locId);
    if (!location) {
        return next( new ApiError(404, "Location not found"));
    }
    
    if(!teamProgress.assignedLocations.find((location)=>location.location.toString()===locId).qrcodeseen){
        teamProgress.assignedLocations.find((location)=>location.location.toString()===locId).qrcodeseen=true;
        teamProgress.assignedLocations[teamProgress.currentRound-1].score+=10;
        if(teamProgress.currentRound==numberOfRounds){
            teamProgress.assignedLocations[teamProgress.currentRound-1].score+=10;
            teamProgress.assignedLocations[teamProgress.currentRound-1].completedAt=new Date();
            teamProgress.CompletedIn=new Date();
            teamProgress.assignedLocations[teamProgress.currentRound-1].status="completed";
        }
        await teamProgress.save();
    }
    

    const hintTaken=teamProgress.assignedLocations.find((location)=>location.location.toString()===locId).puzzlehintUsed;
    const response = {
        text:location.puzzle.text,
        image:location.puzzle.image,
        audio:location.puzzle.audio,
        hint:hintTaken?location.puzzle.puzzleHint:"",
    }
    return res.status(200).json(new ApiResponse(200, response, "Location found"));
})
const checkPuzzleAnswer = asyncHandler(async (req, res, next) => {

    const {locId} = req.params;
    const {answer} = req.body;
    if(!answer){
        return next(new ApiError())
    }
    const teamProgress = await TeamProgress.findOne({teamId: req.user._id,currentLocation: locId});
    if (!teamProgress) {
        return next( new ApiError(404, "Your are not at the correct location"));
    }
    const location = await Location.findById(locId);
    if (!location) {
        return next( new ApiError(404, "Location not found"));
    }
    const current = teamProgress.assignedLocations.find((location)=>location.location.toString()===locId);
    if (current.status === "completed") {
        return next(new ApiError(400, "This round is already completed"));
    }
    current.attempts+=1;
    if (answer.toLowerCase() !== location.puzzle.answer.toLowerCase()) {
        await teamProgress.save();
        return next( new ApiError(400, "Incorrect answer"));
    }
    //answer was correct
    teamProgress.assignedLocations.find((location)=>location.location.toString()===locId).status="completed";
    teamProgress.assignedLocations.find((location)=>location.location.toString()===locId).completedAt=new Date();
    //score logic
    teamProgress.assignedLocations[teamProgress.currentRound-1].score+=10;

    teamProgress.currentRound+=1;
    if(teamProgress.currentRound <= teamProgress.assignedLocations.length){
        teamProgress.assignedLocations[teamProgress.currentRound-1].score+=teamProgress.assignedLocations[teamProgress.currentRound-2].score;
        teamProgress.currentLocation = teamProgress.assignedLocations[teamProgress.currentRound-1].location;
    } else {
        teamProgress.CompletedIn = new Date();
    }
    await teamProgress.save();
    return res.status(200).json(new ApiResponse(200,{}, "Correct answer you can proceed to next round"));
})

const getPuzzleHint = asyncHandler(async (req, res, next) => {
    const {locId} = req.params;
    const teamProgress = await TeamProgress.findOne({teamId: req.user._id,currentLocation: locId});
    if (!teamProgress) {
        return next( new ApiError(404, "Your are not at the correct location"));
    }
    const location = await Location.findById(locId);
    if (!location) {
        return next( new ApiError(404, "Location not found"));
    }
    const current = teamProgress.assignedLocations.find((location)=>location.location.toString()===locId);
    if (!current) {
        return next(new ApiError(400, "Invalid round state"));
    }
    if (!current.puzzlehintUsed) {
        current.puzzlehintUsed = true;
        current.score -= 5;
        await teamProgress.save();
    }
    const response = {
        puzzleHint: location.puzzle.puzzleHint,
    }
    return res.status(200).json(new ApiResponse(200, response, "Puzzle hint fetched successfully"));
})

const giveUpPuzzle=asyncHandler(async(req,res,next)=>{
    const {locId} = req.params;
    const teamProgress = await TeamProgress.findOne({teamId: req.user._id,currentLocation: locId});
    if (!teamProgress) {
        return next( new ApiError(404, "Your are not at the correct location"));
    }
    const location = await Location.findById(locId);
    if (!location) {
        return next( new ApiError(404, "Location not found"));
    }
    const current = teamProgress.assignedLocations.find((location)=>location.location.toString()===locId);
    if (!current) {
        return next(new ApiError(400, "Invalid round state"));
    }
    if (current.status === "completed") {
        return next(new ApiError(400, "This round is already completed"));
    }
    current.status="completed";
    current.completedAt=new Date();
    current.score-=5;
    teamProgress.currentRound+=1;
    if(teamProgress.currentRound <= teamProgress.assignedLocations.length){
        teamProgress.assignedLocations[teamProgress.currentRound-1].score+=teamProgress.assignedLocations[teamProgress.currentRound-2].score;
        teamProgress.currentLocation = teamProgress.assignedLocations[teamProgress.currentRound-1].location;
    } else {
        teamProgress.CompletedIn = new Date();
    }
    await teamProgress.save();
    return res.status(200).json(new ApiResponse(200, null, "Puzzle given up successfully"));
})

export {checkQrLocation,checkPuzzleAnswer,getPuzzleHint,giveUpPuzzle}