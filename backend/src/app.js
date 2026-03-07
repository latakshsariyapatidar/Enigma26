import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorController from "./controllers/errorController.js";
import { ApiResponse } from "./utils/apiResponse.js";
import teamProgressRoutes from "./routes/teamProgressRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "100kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb",
  })
);
app.use(cookieParser());
app.use("/healthcheck", (req, res) => {
  res.status(200).json(new ApiResponse(200, null, "OK"));
});

import userRouter from "./routes/teamRoutes.js";
app.use("/api/v1/users", userRouter);

app.use("/api/v1/teamProgress", teamProgressRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use(errorController);
export default app;
