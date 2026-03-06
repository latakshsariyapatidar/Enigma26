import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import Team  from "../models/teamModel.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  //req has access to cookies
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token)  throw new ApiError(401, "token not found");
  
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    const team = await Team.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
  
    if (!team) return next(new ApiError(401, "Invalid Access Token"));
  
    req.team = team;
  
    next();
  } catch (error) {
    return next(new ApiError(401, error?.message || "Invalid access token"));
  }
});
