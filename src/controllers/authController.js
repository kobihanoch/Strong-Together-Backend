// src/controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/userModel.js";
import BlacklistedToken from "../models/blacklistedTokenModel.js";
import sql from "../config/db.js";

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate data
  const [user] =
    await sql`SELECT id, password, role FROM users WHERE username=${username} LIMIT 1`;
  if (!user) throw createError(401, "Invalid credentials");

  // Check if user exists
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, "Invalid credentials");

  // Sign tokens
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "10d" }
  );

  res.status(200).json({
    message: "Login successful",
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

// @desc    Logout a user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
  // Delete expired tokens every log out attempt
  await sql`DELETE FROM blacklistedtokens WHERE expires_at < now()`;

  // Get tokens from request body and decode
  const authHeader = req.headers["authorization"] || "";
  const accessToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const refreshHeader = req.headers["x-refresh-token"] || "";
  const refreshToken = refreshHeader.startsWith("Bearer ")
    ? refreshHeader.slice(7)
    : null;

  if (!accessToken && !refreshToken) {
    res.status(200).json({ message: "Already logged out" });
    return;
  }

  // Decode tokens
  const decodedRefresh = jwt.decode(refreshToken);
  const expiresAtRefresh = decodedRefresh?.exp
    ? new Date(decodedRefresh.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  const decodedAccess = jwt.decode(accessToken);
  const expiresAtAccess = decodedAccess?.exp
    ? new Date(decodedAccess.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Add to blacklist
  if (accessToken) {
    await sql`INSERT INTO blacklistedtokens (token, expires_at) values(${accessToken}, ${expiresAtAccess}) ON CONFLICT (token) DO NOTHING`;
  }

  // Add to blacklist
  if (refreshToken) {
    await sql`INSERT INTO blacklistedtokens (token, expires_at) values(${refreshToken}, ${expiresAtRefresh}) ON CONFLICT (token) DO NOTHING`;
  }

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
