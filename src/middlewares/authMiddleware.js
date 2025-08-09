import jwt from "jsonwebtoken";
import sql from "../config/db.js";

export const protect = async (req, res, next) => {
  try {
    const getBearer = (h) => (h && h.startsWith("Bearer ") ? h.slice(7) : null);
    // Get access token
    const accessToken = getBearer(req.headers.authorization || "");
    if (!accessToken) {
      return res.status(401).json({ message: "No access token provided" });
    }

    // Check if access token is blacklisted (not valid)
    const [revoked] =
      await sql`SELECT 1 FROM blacklistedtokens WHERE token = ${accessToken} AND expires_at > now() LIMIT 1`;
    if (revoked) {
      return res.status(401).json({ message: "Access token has been revoked" });
    }

    // Decode
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

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
    console.error("Protect Middleware Error:", error);
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};
