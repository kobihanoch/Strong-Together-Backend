import jwt from "jsonwebtoken";
import BlacklistedToken from "../models/blacklistedTokenModel.js";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "No access token provided" });
    }

    const blacklisted = await BlacklistedToken.findOne({ token: accessToken });
    if (blacklisted) {
      return res.status(401).json({ message: "Access token has been revoked" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    req.user = await User.findById(decoded.id).select("-password +role");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Protect Middleware Error:", error);
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};
