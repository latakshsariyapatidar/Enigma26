import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { EventConfig } from "../models/eventConfigModel.js";

const startEvent = asyncHandler(async (req, res, next) => {
    const eventConfig = await EventConfig.findOneAndUpdate(
        {},
        { status: "active" },
        { new: true, upsert: true }
    );
    return res.status(201).json(
        new ApiResponse(201, eventConfig, "Event started successfully")
    );
});

const stopEvent = asyncHandler(async (req, res, next) => {
    const eventConfig = await EventConfig.findOneAndUpdate(
        {},
        { status: "completed" },
        { new: true, upsert: true }
    );
    return res.status(201).json(
        new ApiResponse(201, eventConfig, "Event completed successfully")
    );
});
const upComingEvent = asyncHandler(async (req, res, next) => {
    const eventConfig = await EventConfig.findOneAndUpdate(
        {},
        { status: "upcoming" },
        { new: true, upsert: true }
    );
    return res.status(201).json(
        new ApiResponse(201, eventConfig, "Event set to upcoming successfully")
    );
});

export {
    startEvent,
    stopEvent,
    upComingEvent
};