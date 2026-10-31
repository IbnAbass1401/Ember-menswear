import bcrypt from "bcryptjs";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

// PATCH /api/users/me  { name }
export const updateMe = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name },
    { new: true, runValidators: true }
  );
  if (!user) throw new AppError("This account no longer exists", 401);

  res.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// PATCH /api/users/me/password  { currentPassword, newPassword }
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // password is hidden by default, so ask for it explicitly
  const user = await User.findById(req.user._id).select("+password");
  if (!user) throw new AppError("This account no longer exists", 401);

  const matches = await bcrypt.compare(currentPassword, user.password);
  if (!matches) throw new AppError("Current password is incorrect", 400);

  user.password = newPassword; // hashed by the pre-save hook
  await user.save();

  res.json({ success: true, message: "Password updated" });
};