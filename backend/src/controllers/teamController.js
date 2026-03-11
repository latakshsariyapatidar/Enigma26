import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Team from "../models/teamModel.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse.js";

//helper fuction 
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await Team.findById(userId);
    user.generateSessionId();
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong generating tokens in user controller");
  }
};


const signupUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return next(new ApiError(400, "Please enter name, email, password and role to register"));

  const existingUser = await Team.findOne({ email: email });
  if (existingUser) return next(new ApiError(400, "Email already exists"));

  const user = await Team.create({ name, email, password, role });



  const createdUser = await Team.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    return next(new ApiError(500, "something went wrong while registering the user"));

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Registered successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { name, password } = req.body;
  if (!name || !password) return next(new ApiError(400, "Please enter username and password"));

  const user = await Team.findOne({ name: name }).select("+password");
  if (!user) return next(new ApiError(401, "Invalid username"));
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) return next(new ApiError(401, "Invalid password"));

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );


  const loggedInUser = await Team
    .findById(user._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    /* secure: process.env.NODE_ENV === "production",*/
    secure: true,
    sameSite: "none"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken,
          accessToken,
        },
        "User logged in successfully"
      )
    );


});
//protected route
const logoutUser = asyncHandler(async (req, res) => {
  await Team.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  };


  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out successfully"))

});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;
  if (!oldpassword || !newpassword) return next(new ApiError(400, "Please enter old password and new password"));

  const user = await Team.findById(req.user._id).select("+password");
  if (!user) return next(new ApiError(404, "User not found"));
  const isPasswordValid = await user.isPasswordCorrect(oldpassword);
  if (!isPasswordValid) return next(new ApiError(401, "Invalid old password"));


  if (oldpassword === newpassword) return next(new ApiError(400, "New password cannot be same as old password"));
  user.password = newpassword;
  await user.save();
  res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"))
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) return next(new ApiError(401, "unauthorized request"))

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await Team.findById(decodedToken?._id)

    if (!user) return next(new ApiError(401, "invalid refresh token"))

    if (incomingRefreshToken !== user?.refreshToken) return next(new ApiError(401, "refresh token expired"))




    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id)


    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .cookie("accessToken", newAccessToken, options)
      .json(new ApiResponse(200,
        { accessToken: newAccessToken, refreshToken: newRefreshToken },
        "access token refreshed"
      ))
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh Token")
  }
})


const deleteUser = asyncHandler(async (req, res) => {
  await Team.findByIdAndDelete(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"))
});

export { loginUser, logoutUser, changePassword, getCurrentUser, refreshAccessToken, signupUser, deleteUser };