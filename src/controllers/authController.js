// src/controllers/authController.js
import bcrypt from "bcryptjs";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import {
  decodeAccessToken,
  decodeRefreshToken,
  getAccessToken,
  getRefreshToken,
} from "../utils/tokenUtils.js";
import { sendSystemMessageToUserWhenFirstLogin } from "../services/messagesService.js";
import {
  queryUserByUsernameForLogin,
  querySetUserFirstLoginFalse,
  queryUserDataByUsername,
  queryDeleteExpiredBlacklistedTokens,
  querySelectBlacklistedToken,
  queryUserIdRoleById,
  queryInsertBlacklistedToken,
  queryUpdateExpoPushTokenToNull,
} from "../queries/authQueries.js";

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate data
  const rowsUser = await queryUserByUsernameForLogin(username);
  const [user] = rowsUser;
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
    { expiresIn: "30d" }
  );

  // If first log in send welcome message
  if (user.is_first_login) {
    await querySetUserFirstLoginFalse(user.id);
    sendSystemMessageToUserWhenFirstLogin(user.id, user.name);
  }

  // Fetch all user data
  const rowsUserData = await queryUserDataByUsername(username);
  const [userData] = rowsUserData;

  res.set("Cache-Control", "no-store");
  res.status(200).json({
    message: "Login successful",
    user: userData.user_data,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

// @desc    Logout a user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = async (req, res) => {
  // Delete expired tokens every log out attempt
  await queryDeleteExpiredBlacklistedTokens();

  // Get tokens from request body and decode
  const refreshToken = getRefreshToken(req);
  const accessToken = getAccessToken(req);

  // Decode tokens
  const decodedAccess = decodeAccessToken(accessToken);
  const expiresAtAccess = decodedAccess?.exp
    ? new Date(decodedAccess.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  const decodedRefresh = decodeRefreshToken(refreshToken);
  const expiresAtRefresh = decodedRefresh?.exp
    ? new Date(decodedRefresh.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  await queryUpdateExpoPushTokenToNull(decodedRefresh.id);

  // Add to blacklist
  if (decodedAccess) {
    await queryInsertBlacklistedToken(accessToken, expiresAtAccess);
  }
  if (decodedRefresh) {
    await queryInsertBlacklistedToken(refreshToken, expiresAtRefresh);
  }

  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Refresh token (sliding session)
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res) => {
  await queryDeleteExpiredBlacklistedTokens();

  const refreshToken = getRefreshToken(req);
  if (!refreshToken) throw createError(401, "No refresh token provided");

  // Verify refresh token
  const decoded = decodeRefreshToken(refreshToken);
  if (!decoded) throw createError(401, "Invalid or expired refresh token");

  // Ensure not revoked
  const rowsRevoked = await querySelectBlacklistedToken(refreshToken);
  const [revoked] = rowsRevoked;
  if (revoked) throw createError(401, "Refresh token has been revoked");

  // User still exists
  const rowsUser = await queryUserIdRoleById(decoded.id);
  const [user] = rowsUser;
  if (!user) throw createError(401, "User not found");

  // One-time use refresh: blacklist the old refresh
  const expR = decoded.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);
  await queryInsertBlacklistedToken(refreshToken, expR);

  // Issue fresh access + fresh refresh (rotate)
  const newAccess = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const newRefresh = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  res.set("Cache-Control", "no-store");
  res.status(200).json({
    message: "Access token refreshed",
    accessToken: newAccess,
    refreshToken: newRefresh,
  });
};
