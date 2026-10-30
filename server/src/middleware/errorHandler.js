import AppError from "../utils/AppError.js";

export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.name === "ValidationError") {
    error = new AppError(Object.values(err.errors).map((e) => e.message).join(", "), 400);
  } else if (err.name === "CastError") {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`${field} already exists`, 409);
  } else if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again.", 401);
  } else if (err.name === "TokenExpiredError") {
    error = new AppError("Your session has expired. Please log in again.", 401);
  } else if (err.name === "ZodError") {
    error = new AppError(err.issues.map((i) => i.message).join(", "), 400);
  } else if (err.type === "entity.parse.failed") {
    error = new AppError("Invalid JSON in request body", 400);
  }

  const statusCode = error.statusCode || 500;
  if (!error.isOperational) console.error(err);

  res.status(statusCode).json({
    success: false,
    message: error.isOperational ? error.message : "Something went wrong on our side",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};