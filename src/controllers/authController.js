// src/controllers/authController.js
import bcrypt from "bcryptjs";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import sql from "../config/db.js";
import {
  queryBumpTokenVersionAndGetSelfData,
  queryBumpTokenVersionAndGetSelfDataCAS,
  querySetUserFirstLoginFalse,
  queryUpdateExpoPushTokenToNull,
  queryUpdateUserPassword,
  queryUpdateUserVerficiationStatus,
  queryUserByIdentifierForLogin,
  queryUserByUsername,
} from "../queries/authQueries.js";
import { queryUserExistsByUsernameOrEmail } from "../queries/userQueries.js";
import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
} from "../services/emailService.js";
import { sendSystemMessageToUserWhenFirstLogin } from "../services/messagesService.js";
import {
  generateVerificationFailedHTML,
  generateVerifiedHTML,
} from "../templates/responseHTMLTemplates.js";
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

  const jkt = req.headers["dpop-key-binding"];
  if (
    /*req.headers["x-app-version"] !== "4.1.0" &&
    req.headers["x-app-version"] !== "4.1.1"*/ true &&
    process.env.DPOP_ENABLED === "true"
  ) {
    if (!jkt) {
      throw createError(400, "DPoP-Key-Binding header is missing.");
    }
  }

  // Validate data
  const [user = null] = await queryUserByIdentifierForLogin(identifier);
  if (!user) throw createError(401, "Invalid credentials");

  // Check if user exists
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, "Invalid credentials");

  // Check verification
  if (!user.is_verified) {
    throw createError(401, "You need to verify you account");
  }

  // If first log in send welcome message
  if (user.is_first_login) {
    await querySetUserFirstLoginFalse(user.id);
    try {
      await sendSystemMessageToUserWhenFirstLogin(user.id, user.name);
    } catch (e) {
      console.log(e);
    }
  }

  // Fetch all user data and bump token version
  const rowsUserData = await queryBumpTokenVersionAndGetSelfData(user.id);
  const [{ token_version, user_data: userData }] = rowsUserData;

  const cnfClaim = {
    cnf: {
      jkt: jkt
        ? jkt.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
        : "",
    },
  };

  // Sign tokens with DPoP confirmation claim
  const accessToken = jwt.sign(
    {
      id: userData.id,
      role: userData.role,
      tokenVer: token_version,
      ...cnfClaim,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "5m" }
  );

  const refreshToken = jwt.sign(
    {
      id: userData.id,
      role: userData.role,
      tokenVer: token_version,
      ...cnfClaim,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "14d" }
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

  if (decodedRefresh) {
    //await queryInsertBlacklistedToken(refreshToken, expiresAtRefresh);
    await Promise.all([
      queryUpdateExpoPushTokenToNull(decodedRefresh.id),
      queryBumpTokenVersionAndGetSelfData(decodedRefresh.id),
    ]);
  }

  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Refresh token (sliding session)
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res) => {
  //await queryDeleteExpiredBlacklistedTokens();

  const dpopJkt = req.dpopJkt;
  if (
    /*req.headers["x-app-version"] !== "4.1.0" &&
    req.headers["x-app-version"] !== "4.1.1"*/ true &&
    process.env.DPOP_ENABLED === "true"
  ) {
    if (!dpopJkt) {
      // Should not happen if dpopValidationMiddleware ran first
      throw createError(500, "Internal error: DPoP JKT not found on request.");
    }
  }

  const refreshToken = getRefreshToken(req);
  if (!refreshToken) throw createError(401, "No refresh token provided");

  // Verify refresh token
  const decoded = decodeRefreshToken(refreshToken);
  if (!decoded) throw createError(401, "Invalid or expired refresh token");

  if (
    /*req.headers["x-app-version"] !== "4.1.0" &&
    req.headers["x-app-version"] !== "4.1.1"*/ true &&
    process.env.DPOP_ENABLED
  ) {
    const tokenJkt = decoded.cnf?.jkt;
    if (!tokenJkt || tokenJkt !== dpopJkt) {
      throw createError(401, "Proof-of-Possession failed (JKT mismatch).");
    }
  }

  // Bump token version and sign new JWTs with new tokev version (CAS)
  // If not rows - there is a gap between last token and token_version => login was fired in another device -> logout
  const [user = null] = await queryBumpTokenVersionAndGetSelfDataCAS(
    decoded.id,
    decoded.tokenVer
  );
  if (!user) throw createError(401, "New login required");

  const { token_version, user_data: userData } = user;

  const cnfClaim = {
    cnf: {
      jkt: dpopJkt
        ? dpopJkt.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
        : "",
    },
  }; // Use the JKT from the proof

  // Issue fresh access + fresh refresh (rotate)
  const newAccess = jwt.sign(
    {
      id: userData.id,
      role: userData.role,
      tokenVer: token_version,
      ...cnfClaim,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "5m" }
  );

  const newRefresh = jwt.sign(
    {
      id: userData.id,
      role: userData.role,
      tokenVer: token_version,
      ...cnfClaim,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "14d" }
  );

  res.set("Cache-Control", "no-store");
  res.status(200).json({
    message: "Access token refreshed",
    accessToken: newAccess,
    refreshToken: newRefresh,
    userId: userData.id,
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
    return res
      .status(401)
      .type("html")
      .set("Cache-Control", "no-store")
      .send(generateVerificationFailedHTML());
  }
  await queryUpdateUserVerficiationStatus(decoded.sub, true);
  const html = generateVerifiedHTML();

  return res
    .status(200)
    .type("html")
    .set("Cache-Control", "no-store")
    .send(html);
};

// @desc    Validate user acoount
// @route   POST /api/auth/sendverificationemail
// @access  Public
export const sendVerificationMail = async (req, res) => {
  const { email } = req.body;
  const [user = null] =
    await sql`SELECT id, name FROM users WHERE email=${email}`;
  if (!user) return res.status(204).end();
  const { id, name } = user;
  await sendVerificationEmail(email, id, name);
  return res.status(204).end();
};

// @desc    Resend email to new address and verify user acoount
// @route   PUT /api/auth/changeemailverify
// @access  Public
export const changeEmailAndVerify = async (req, res) => {
  const { username, password, newEmail } = req.body;

  const [user = null] = await queryUserByUsername(username);
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
  return res.status(200).json({ isVerified: user?.is_verified ?? false });
};

// @desc    Sends email for resetting password
// @route   POST /api/auth/forgotpassemail
// @access  Public
export const sendChangePassEmail = async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) throw createError(400, "Please fill username or email");
  const [user = null] =
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
  await Promise.all([
    queryUpdateUserPassword(decoded.sub, hash),
    queryBumpTokenVersionAndGetSelfData(decoded.sub),
  ]);
  return res.status(200).json({ ok: true });
};
