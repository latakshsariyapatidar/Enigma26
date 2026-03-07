import {loginUser, logoutUser, changePassword, getCurrentUser, refreshAccessToken, signupUser,deleteUser} from "../controllers/teamController.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
const userRouter = Router();

userRouter.route("/signup").post( signupUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/change-password").post(verifyJWT, changePassword);
userRouter.route("/current").get(verifyJWT, getCurrentUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/delete").delete(verifyJWT, deleteUser);


export default userRouter;