import createError from "http-errors";
import sql from "../config/db.js";
import { decodeAccessToken, getAccessToken } from "../utils/tokenUtils.js";

export const protect = async (req, res, next) => {
  try {
    // Get access token
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return res.status(401).json({ message: "No access token provided" });
    }

    // Check if access token is blacklisted (not valid)
    const [revoked] =
      await sql`SELECT 1 FROM blacklistedtokens WHERE token = ${accessToken} AND expires_at > now() LIMIT 1`;
    if (revoked) {
      throw createError(401, "Access token has been revoked");
    }

    // Decode
    const decoded = decodeAccessToken(accessToken);
    if (!decoded) {
      throw createError(401, "Access token is not valid");
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
  } catch (error) {
    console.error("Protect Middleware Error:", err);
    next(createError(401, err.message || "Invalid or expired access token"));
  }
};
