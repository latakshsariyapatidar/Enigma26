import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { EventConfig } from "../models/eventConfigModel.js";

export const checkEventActive = asyncHandler(async (req, res, next) => {
  const config = await EventConfig.findOne();

  if (!config || config.status === "upcoming") {
    return next(new ApiError(403, "Event has not started yet"));
  }

  if (config.status === "completed") {
    return next(new ApiError(403, "Event has ended"));
  }

  next();
});
