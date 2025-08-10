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
    { expiresIn: "4h" }
  );

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

// @desc    Check if user is authenticated
// @route   GET /api/auth/checkauth
// @access  Private
export const checkAuthAndRefresh = async (req, res) => {
  // Delete expired tokens every log out attempt
  await sql`DELETE FROM blacklistedtokens WHERE expires_at < now()`;

  const refreshToken = getRefreshToken(req);
  const decodedRefresh = decodeRefreshToken(refreshToken);
  // Mostly will fail here if user is not logged in
  if (!decodedRefresh) {
    throw createError(401, "Invalid or expired refresh token");
  }

  // Check if refresh token is blacklisted
  const [revoked] =
    await sql`SELECT token FROM blacklistedtokens WHERE token=${refreshToken}`;
  if (revoked) {
    throw createError(401, "Refresh token has been revoked");
  }

  // Check if access token exists => If true blacklist
  const accessToken = getAccessToken(req);
  if (accessToken && accessToken.length > 0) {
    const decodedAccess = decodeAccessToken(accessToken);
    const expA = decodedAccess?.exp
      ? new Date(decodedAccess.exp * 1000)
      : new Date(Date.now() + 15 * 60 * 1000);
    await sql`
      INSERT INTO blacklistedtokens (token, expires_at)
      VALUES (${accessToken}, ${expA})
      ON CONFLICT (token) DO NOTHING`;
  }

  // Blacklist refresh token
  const expR = decodedRefresh.exp
    ? new Date(decodedRefresh.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);
  await sql`
    INSERT INTO blacklistedtokens (token, expires_at)
    VALUES (${refreshToken}, ${expR})
    ON CONFLICT (token) DO NOTHING`;

  // Check if user exists
  const [user] =
    await sql`SELECT id, role FROM users WHERE id=${decodedRefresh.id} LIMIT 1`;
  if (!user) throw createError(401, "User not found");

  // Generate new tokens
  const accessTokenNew = jwt.sign(
    { id: decodedRefresh.id, role: decodedRefresh.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
  const refreshTokenNew = jwt.sign(
    { id: decodedRefresh.id, role: decodedRefresh.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "4h" }
  );
  res.status(200).json({
    message: "User is authenticated",
    accessToken: accessTokenNew,
    refreshToken: refreshTokenNew,
  });
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res) => {
  // Check if refresh token is sent
  const refreshToken = getRefreshToken(req);
  if (!refreshToken) throw createError(401, "No refresh token provided");

  // Decode
  const decoded = decodeRefreshToken(refreshToken);
  if (!decoded) {
    throw createError(401, "Invalid or expired refresh token");
  }

  const [revoked] =
    await sql`SELECT token FROM blacklistedtokens WHERE token=${refreshToken} LIMIT 1`;
  if (revoked) {
    throw createError(401, "Refresh token has been revoked");
  }

  // Find user
  const [user] =
    await sql`SELECT id, role FROM users WHERE id=${decoded.id} LIMIT 1`;
  if (!user) throw createError(401, "User not found");

  // Sign a new access token
  const newAccess = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  res
    .status(200)
    .json({ message: "Access token refreshed", accessToken: newAccess });
};
