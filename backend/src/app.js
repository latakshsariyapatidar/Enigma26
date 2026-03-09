import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorController from "./controllers/errorController.js";
import locationRoutes from "./routes/locationRoutes.js";
import teamProgressRoutes from "./routes/teamProgressRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { ApiResponse } from "./utils/apiResponse.js";
import qrRouter from "./routes/qrCodeRoutes.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "@exortek/express-mongo-sanitize";
const app = express();


// * helmet -- for Security HTTP headers
app.use(
  helmet({
    hsts: false,
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Data Sanitization --- against NoSQL Query Injection attacks and XSS attacks
// ! Middleware order matters: these need to be after the body is parsed

// * NoSQL query Injection attacks
app.use(mongoSanitize());

// * Rate Limiter -- from same IP
// ? The limit resets automatically if the app restarts in the middle
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests --- Try again after an hour!!",
});
app.use("/api", limiter);

app.use(cookieParser());
app.use("/healthcheck", (req, res) => {
  res.status(200).json(new ApiResponse(200, null, "OK"));
});

import userRouter from "./routes/teamRoutes.js";
app.use("/api/v1/users", userRouter);

app.use("/api/v1/teamProgress", teamProgressRoutes);

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/location", locationRoutes);
app.use("/api/v1/qrCode", qrRouter)
app.use(errorController);
export default app;
