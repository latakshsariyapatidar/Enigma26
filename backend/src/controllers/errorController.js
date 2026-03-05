/* eslint-disable arrow-body-style */
import {ApiError} from "../utils/apiError.js";

console.log("NODE_ENV =", process.env.NODE_ENV);

const handleCastErrorDB = (err) => {
  return new ApiError(400, `Invalid ${err.path} ${err.value}`);
};

const handleDuplicateErrorDB = (err) => {
  return new ApiError(
    400,
    `Duplicate field value ${err.keyValue.name}, Please use another value!!` // ! must change based on what is being kept unique
  );
};

// ? We have to resend mongoose errors in our format because if not the API will send the generic error during
// ? production for non-Operational errors since the mongoose errors are not marked Operational
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input! ${errors.join("& ")}`;
  return new ApiError(400, message);
};

const handleJsonWebTokenError = (err) => {
  return new ApiError(401, `The Token is invalid -- ${err.message}`);
};

const handleExpiredJWTError = (err) => {
  return new ApiError(401, `The token is expired! -- Please Login again!!`);
};

const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log error for yourself since it is an unexpected error
    console.error("Error 🔴", err);

    //send generic response
    res.status(500).json({
      status: "error",
      message: "OOPs! Something Went Wrong!!!",
    });
  }
};

export default (err, req, res, next) => {
  //   console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(res, err);
  } else if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax

    // let error = { ...err }; && structured clone cant be used because in spread operator the message is
    // not copied because its a shallow copy and in structure clone the prototypal chain is lost

    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }
    if (err.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
    if (err.name === "JsonWebTokenError") {
      error = handleJsonWebTokenError(error);
    }
    if (err.name === "TokenExpiredError") {
      error = handleExpiredJWTError(error);
    }

    sendErrorProd(res, error);
  }
};
