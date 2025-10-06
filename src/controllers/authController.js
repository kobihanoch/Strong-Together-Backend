// src/controllers/authController.js
import bcrypt from "bcryptjs";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import sql from "../config/db.js";
import {
  queryGetCurrentTokenVersion,
  querySetUserFirstLoginFalse,
  queryUpdateExpoPushTokenToNull,
  queryUpdateUserPassword,
  queryUpdateUserVerficiationStatus,
  queryUserByIdentifierForLogin,
  queryUserByUsername,
  queryUserDataByID,
  queryUserIdRoleById,
} from "../queries/authQueries.js";
import { queryUserExistsByUsernameOrEmail } from "../queries/userQueries.js";
import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
} from "../services/emailService.js";
import { sendSystemMessageToUserWhenFirstLogin } from "../services/messagesService.js";
import { generateVerifiedHTML } from "../templates/responseHTMLTemplates.js";
import {
  decodeForgotPasswordToken,
  decodeRefreshToken,
  decodeVerifyToken,
  getRefreshToken,
} from "../utils/tokenUtils.js";

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  // Validate data

  const rowsUser = await queryUserByIdentifierForLogin(identifier);
  const [user] = rowsUser;
  if (!user) throw createError(401, "Invalid credentials");

  // Check if user exists
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, "Invalid credentials");

  // If first log in send welcome message
  if (user.is_first_login) {
    await querySetUserFirstLoginFalse(user.id);
    sendSystemMessageToUserWhenFirstLogin(user.id, user.name);
  }

  // Fetch all user data and bump token version
  const rowsUserData = await queryUserDataByID(user.id);
  const [{ token_version, user_data: userData }] = rowsUserData;

  if (!userData?.is_verified) {
    throw createError(401, "You need to verify you account");
  }
  // Sign tokens
  const accessToken = jwt.sign(
    { id: user.id, role: user.role, tokenVer: token_version },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, role: user.role, tokenVer: token_version },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  res.set("Cache-Control", "no-store");
  res.status(200).json({
    message: "Login successful",
    user: userData?.id,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

// @desc    Logout a user
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res) => {
  // Delete expired tokens every log out attempt
  //await queryDeleteExpiredBlacklistedTokens();

  // Get tokens from request body and decode
  const refreshToken = getRefreshToken(req);

  // Decode tokens
  const decodedRefresh = decodeRefreshToken(refreshToken);
  const expiresAtRefresh = decodedRefresh?.exp
    ? new Date(decodedRefresh.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  if (decodedRefresh) {
    //await queryInsertBlacklistedToken(refreshToken, expiresAtRefresh);
    await queryUpdateExpoPushTokenToNull(decodedRefresh.id);
  }

  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Refresh token (sliding session)
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res) => {
  //await queryDeleteExpiredBlacklistedTokens();

  const refreshToken = getRefreshToken(req);
  if (!refreshToken) throw createError(401, "No refresh token provided");

  // Verify refresh token
  const decoded = decodeRefreshToken(refreshToken);
  if (!decoded) throw createError(401, "Invalid or expired refresh token");
  const [{ token_version: currentTokenVersion }] =
    await queryGetCurrentTokenVersion(decoded.id);

  if (currentTokenVersion !== decoded.tokenVer)
    throw createError(401, "New login required");

  // Ensure not revoked
  /*const rowsRevoked = await querySelectBlacklistedToken(refreshToken);
  const [revoked] = rowsRevoked;
  if (revoked) throw createError(401, "Refresh token has been revoked");*/

  // User still exists
  const rowsUser = await queryUserIdRoleById(decoded.id);
  const [user] = rowsUser;
  if (!user) throw createError(401, "User not found");

  // One-time use refresh: blacklist the old refresh
  const expR = decoded.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);
  //await queryInsertBlacklistedToken(refreshToken, expR);

  // Issue fresh access + fresh refresh (rotate)
  const newAccess = jwt.sign(
    { id: user.id, role: user.role, tokenVer: currentTokenVersion },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const newRefresh = jwt.sign(
    { id: user.id, role: user.role, tokenVer: currentTokenVersion },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  res.set("Cache-Control", "no-store");
  res.status(200).json({
    message: "Access token refreshed",
    accessToken: newAccess,
    refreshToken: newRefresh,
    userId: user.id,
  });
};

// @desc    Verify user acoount
// @route   GET /api/auth/verify
// @access  Public
export const verifyUserAccount = async (req, res) => {
  const { token } = req.query;
  if (!token) throw createError(400, "Missing token");
  const decoded = decodeVerifyToken(token);
  if (!decoded) {
    throw createError(400, "Verfication token is not valid");
  }
  await queryUpdateUserVerficiationStatus(decoded.sub, true);
  const html = generateVerifiedHTML();

  res.status(200).type("html").set("Cache-Control", "no-store").send(html);
};

// @desc    Validate user acoount
// @route   POST /api/auth/sendverificationemail
// @access  Public
export const sendVerificationMail = async (req, res) => {
  const { email } = req.body;
  const [{ id, name }] =
    await sql`SELECT id, name FROM users WHERE email=${email}`;
  await sendVerificationEmail(email, id, name);
  return res.status(204).end();
};

// @desc    Resend email to new address and verify user acoount
// @route   PUT /api/auth/changeemailverify
// @access  Public
export const changeEmailAndVerify = async (req, res) => {
  const { username, password, newEmail } = req.body;

  const [user] = await queryUserByUsername(username);
  if (!user) throw createError(401, "Invalid credentials");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createError(401, "Invalid credentials");

  if (user.is_verified) throw createError(400, "Account already verified");

  const [exists] = await queryUserExistsByUsernameOrEmail(null, newEmail);
  if (exists) throw createError(409, "Email already in use");

  await sql`UPDATE users SET email = ${newEmail} WHERE id = ${user.id}::uuid`;
  await sendVerificationEmail(newEmail, user.id, user.name);

  res.status(204).end();
};

// @desc    Resend email to new address and verify user acoount
// @route   GET /api/auth/checkuserverify
// @access  Public
export const checkUserVerify = async (req, res) => {
  const [user] =
    await sql`SELECT is_verified FROM users WHERE username=${req.query.username}`;
  return res.status(200).json({ isVerified: user.is_verified });
};

// @desc    Sends email for resetting password
// @route   POST /api/auth/forgotpassemail
// @access  Public
export const sendChangePassEmail = async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) throw createError(400, "Please fill username or email");
  const [user] =
    await sql`SELECT id, email, name FROM users WHERE email=${identifier} OR username=${identifier} LIMIT 1`;
  // Don;t overshare
  if (!user) return res.status(204).end();

  await sendForgotPasswordEmail(user.email, user.id, user.name);

  return res.status(204).end();
};

// @desc    Update password
// @route   PUT /api/auth/resetpassword
// @access  Public
export const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;
  if (!token) throw createError(400, "Missing token");
  const decoded = decodeForgotPasswordToken(token);
  if (!decoded) {
    throw createError(400, "Verfication token is not valid");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  await queryUpdateUserPassword(decoded.sub, hash);
  return res.status(200).json({ ok: true });
};
