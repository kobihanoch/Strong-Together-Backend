// src/controllers/authController.js
import bcrypt from "bcryptjs";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import sql from "../config/db.js";
import {
  decodeAccessToken,
  decodeRefreshToken,
  getAccessToken,
  getRefreshToken,
} from "../utils/tokenUtils.js";
import { sendSystemMessageToUserWhenFirstLogin } from "../services/messagesService.js";

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate data
  const [user] =
    await sql`SELECT id, password, role, is_first_login, name FROM users WHERE username=${username} LIMIT 1`;
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
    await sql`UPDATE users SET is_first_login=FALSE WHERE id=${user.id} RETURNING id`;
    sendSystemMessageToUserWhenFirstLogin(user.id, user.name);
  }

  // Fetch all user data
  const [userData] =
    await sql`SELECT to_jsonb(users) - 'password' AS user_data FROM users WHERE username = ${username} LIMIT 1`;

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
  await sql`DELETE FROM blacklistedtokens WHERE expires_at < now()`;

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

  // Add to blacklist
  if (decodedAccess) {
    await sql`INSERT INTO blacklistedtokens (token, expires_at) values(${accessToken}, ${expiresAtAccess}) ON CONFLICT (token) DO NOTHING`;
  }
  if (decodedRefresh) {
    await sql`INSERT INTO blacklistedtokens (token, expires_at) values(${refreshToken}, ${expiresAtRefresh}) ON CONFLICT (token) DO NOTHING`;
  }

  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Refresh token (sliding session)
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res) => {
  await sql`DELETE FROM blacklistedtokens WHERE expires_at < now()`;

  const refreshToken = getRefreshToken(req);
  if (!refreshToken) throw createError(401, "No refresh token provided");

  // Verify refresh token
  const decoded = decodeRefreshToken(refreshToken);
  if (!decoded) throw createError(401, "Invalid or expired refresh token");

  // Ensure not revoked
  const [revoked] =
    await sql`SELECT token FROM blacklistedtokens WHERE token=${refreshToken} LIMIT 1`;
  if (revoked) throw createError(401, "Refresh token has been revoked");

  // User still exists
  const [user] =
    await sql`SELECT id, role FROM users WHERE id=${decoded.id} LIMIT 1`;
  if (!user) throw createError(401, "User not found");

  // One-time use refresh: blacklist the old refresh
  const expR = decoded.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);
  await sql`
    INSERT INTO blacklistedtokens (token, expires_at)
    VALUES (${refreshToken}, ${expR})
    ON CONFLICT (token) DO NOTHING`;

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
