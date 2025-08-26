import createError from "http-errors";
import sql from "../config/db.js";
import { decodeAccessToken, getAccessToken } from "../utils/tokenUtils.js";
import { queryGetCurrentTokenVersion } from "../queries/authQueries.js";

export const protect = async (req, res, next) => {
  try {
    // Get access token
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return res.status(401).json({ message: "No access token provided" });
    }

    // Decode
    const decoded = decodeAccessToken(accessToken);
    if (!decoded) {
      throw createError(401, "Access token is not valid");
    }
    const [{ token_version: currentTokenVersion }] =
      await queryGetCurrentTokenVersion(decoded.id);
    if (decoded.tokenVer !== currentTokenVersion) {
      throw createError(401, "New login required");
    }

    // Fetch user id and role
    const [user] = await sql`SELECT id, role FROM users WHERE id=${decoded.id}`;

    // If user not found
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Inject to request
    req.user = user;

    next();
  } catch (err) {
    next(createError(401, err.message || "Invalid or expired access token"));
  }
};
