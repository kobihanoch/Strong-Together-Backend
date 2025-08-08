// src/controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/userModel.js";
import BlacklistedToken from "../models/blacklistedTokenModel.js";

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate data
  const user = await User.findOne({ username }).select("+password");
  if (!user) throw createError(401, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, "Invalid credentials");

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(200).json({ message: "Login successful" });
};

// @desc    Logout a user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
  const accessTokenCookies = req.cookies.accessToken;
  const refreshTokenCookies = req.cookies.refreshToken;

  if (!accessTokenCookies && !refreshTokenCookies) {
    res.status(200).json({ message: "Already logged out" });
    return;
  }

  const decodedRefresh = jwt.decode(refreshTokenCookies);
  const expiresAt = decodedRefresh?.exp
    ? new Date(decodedRefresh.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  if (accessTokenCookies) {
    const exists = await BlacklistedToken.findOne({
      token: accessTokenCookies,
    });
    if (!exists)
      await BlacklistedToken.create({ token: accessTokenCookies, expiresAt });
  }

  if (refreshTokenCookies) {
    const exists = await BlacklistedToken.findOne({
      token: refreshTokenCookies,
    });
    if (!exists)
      await BlacklistedToken.create({ token: refreshTokenCookies, expiresAt });
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Check if user is authenticated
// @route   GET /api/auth/checkauth
// @access  Public
export const checkIfUserAuthenticated = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  const token = accessToken || refreshToken;

  if (!token) throw createError(401, "Not authenticated");

  let decoded;
  if (accessToken) {
    decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
  } else if (refreshToken) {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    throw createError(401, "No access token, need to refresh.");
  }

  const user = await User.findById(decoded.id).select("-password +role");
  if (!user) throw createError(401, "User not found");

  res.status(200).json({ message: "User is authenticated" });
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw createError(401, "No refresh token provided");

  const blacklisted = await BlacklistedToken.findOne({ token });
  if (blacklisted) throw createError(401, "Refresh token is blacklisted.");

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select("-password +role");
  if (!user) throw createError(401, "User not found");

  const newAccess = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  res.cookie("accessToken", newAccess, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({ message: "Access token refreshed" });
};
