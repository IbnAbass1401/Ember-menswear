import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { COOKIE_NAME } from "../utils/token.js";

export const protect = async (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) throw new AppError("Please log in to continue", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new AppError("This account no longer exists", 401);

  req.user = user;
  next();
};

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("You don't have permission to do that", 403);
    }
    next();
  };