import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { sendTokenCookie, clearTokenCookie } from "../utils/token.js";

const userResponse = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new AppError("An account with this email already exists", 409);

  const user = await User.create({ name, email, password });
  sendTokenCookie(res, user._id);

  res.status(201).json({ success: true, user: userResponse(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  sendTokenCookie(res, user._id);
  res.json({ success: true, user: userResponse(user) });
};

export const logout = (req, res) => {
  clearTokenCookie(res);
  res.json({ success: true, message: "Logged out" });
};

export const getMe = (req, res) => {
  res.json({ success: true, user: userResponse(req.user) });
};