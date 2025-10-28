import createError from "http-errors";
import sql from "../config/db.js";
import { decodeAccessToken, getAccessToken } from "../utils/tokenUtils.js";
import { queryGetCurrentTokenVersion } from "../queries/authQueries.js";
import * as crypto from "crypto";

export const protect = async (req, res, next) => {
  const dpopJkt = req.dpopJkt;
  try {
    if (process.env.DPOP_ENABLED === "true") {
      if (!dpopJkt) {
        throw createError(
          500,
          "Internal error: DPoP JKT not found on request."
        );
      }
    }

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

    // Check if access token JKT is equal to DPoP JKT
    if (process.env.DPOP_ENABLED === "true") {
      const tokenJkt = decoded.cnf?.jkt;

      if (!tokenJkt || tokenJkt !== dpopJkt) {
        throw createError(401, "Proof-of-Possession failed (JKT mismatch).");
      }

      const currentAth = crypto
        .createHash("sha256")
        .update(accessToken, "ascii")
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

      if (currentAth !== req.dpopAth)
        throw createError(401, "DPoP ath doens't match.");
    }

    const [{ token_version: currentTokenVersion }] =
      await queryGetCurrentTokenVersion(decoded.id);
    if (decoded.tokenVer !== currentTokenVersion) {
      throw createError(401, "New login required");
    }

    // Fetch user id and role
    const [user] =
      await sql`SELECT id, role, is_verified FROM users WHERE id=${decoded.id}`;

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user?.is_verified) {
      return res
        .status(401)
        .json({ message: "A validation email is pending." });
    }

    // Inject to request
    req.user = user;

    next();
  } catch (err) {
    next(createError(401, err.message || "Invalid or expired access token"));
  }
};
