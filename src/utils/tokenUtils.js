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

/*
 * Extracts the access token from the Authorization header.
 * @param {object} req - Express request object.
 * @returns {string|null}
 */
export const getAccessToken = (req) => {
  return extractBearerToken(req.headers.authorization || "");
};

/*
 * Extracts the refresh token from the x-refresh-token header.
 * @param {object} req - Express request object.
 * @returns {string|null}
 */
export const getRefreshToken = (req) => {
  return extractBearerToken(req.headers["x-refresh-token"] || "");
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
  } catch {
    return null;
  }
};
