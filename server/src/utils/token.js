import jwt from "jsonwebtoken";

export const COOKIE_NAME = "ember_token";

const isProd = process.env.NODE_ENV === "production";

const baseOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

export const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const sendTokenCookie = (res, userId) => {
  res.cookie(COOKIE_NAME, signToken(userId), {
    ...baseOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearTokenCookie = (res) => {
  res.clearCookie(COOKIE_NAME, baseOptions);
};