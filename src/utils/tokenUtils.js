// src/utils/tokenUtils.js
import jwt from "jsonwebtoken";

/*
 * Extracts a Bearer token from a header string safely.
 * Supports both "Bearer <token>" and raw token formats.
 * @param {string} rawHeader - The raw header value.
 * @returns {string|null} - The extracted token or null if not found.
 */
export const extractBearerToken = (rawHeader) => {
  if (!rawHeader || typeof rawHeader !== "string") return null;
  return rawHeader.startsWith("Bearer ")
    ? rawHeader.slice(7).trim()
    : rawHeader.trim() || null;
};

export const extractDpopToken = (rawHeader) => {
  if (!rawHeader || typeof rawHeader !== "string") return null;
  if (!rawHeader.startsWith("DPoP ")) return null;
  return rawHeader.slice(5).trim() || null;
};

/*
 * Extracts the access token from the Authorization header.
 * @param {object} req - Express request object.
 * @returns {string|null}
 */
export const getAccessToken = (req) => {
  return (
    extractDpopToken(req.headers.authorization) ||
    extractBearerToken(req.headers.authorization)
  );
};

/*
 * Extracts the refresh token from the x-refresh-token header.
 * @param {object} req - Express request object.
 * @returns {string|null}
 */
export const getRefreshToken = (req) => {
  return (
    extractDpopToken(req.headers["x-refresh-token"]) ||
    extractBearerToken(req.headers["x-refresh-token"])
  );
};

export const decodeRefreshToken = (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    return decoded;
  } catch {
    return null;
  }
};

export const decodeAccessToken = (accessToken) => {
  let decoded;
  try {
    decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    return decoded;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const decodeVerifyToken = (verifyToken) => {
  let decoded;
  try {
    decoded = jwt.verify(verifyToken, process.env.JWT_VERIFY_SECRET);
    return decoded;
  } catch {
    return null;
  }
};

export const decodeForgotPasswordToken = (forgotPasswordToken) => {
  let decoded;
  try {
    decoded = jwt.verify(
      forgotPasswordToken,
      process.env.JWT_FORGOT_PASSWORD_SECRET
    );
    return decoded;
  } catch {
    return null;
  }
};

export const decodeChangeEmailToken = (changeEmailToken) => {
  let decoded;
  try {
    decoded = jwt.verify(changeEmailToken, process.env.CHANGE_EMAIL_SECRET);
    return decoded;
  } catch {
    return null;
  }
};

import crypto from "crypto";

export const generateJti = () => {
  return crypto.randomBytes(16).toString("hex");
};
