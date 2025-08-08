import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import BlacklistedToken from "../models/blacklistedTokenModel.js";

// Login a user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Logout a user
export const logoutUser = async (req, res) => {
  try {
    const accessTokenCookies = req.cookies.accessToken;
    const refreshTokenCookies = req.cookies.refreshToken;

    // Check if the tokens are expired
    if (!accessTokenCookies && !refreshTokenCookies) {
      return res.status(200).json({ message: "Already logged out" });
    }

    const decodedAccess = jwt.decode(accessTokenCookies);
    const decodedRefresh = jwt.decode(refreshTokenCookies);

    const expiresAt = decodedRefresh?.exp
      ? new Date(decodedRefresh.exp * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 1 day

    // Check if tokens are already inside blacklisted, if not put them inside
    if (accessTokenCookies) {
      const blacklistedAccess = await BlacklistedToken.findOne({
        token: accessTokenCookies,
      });
      if (!blacklistedAccess) {
        await BlacklistedToken.create({ token: accessTokenCookies, expiresAt });
      }
    }

    if (refreshTokenCookies) {
      const blackListedRefresh = await BlacklistedToken.findOne({
        token: refreshTokenCookies,
      });
      if (!blackListedRefresh) {
        await BlacklistedToken.create({
          token: refreshTokenCookies,
          expiresAt,
        });
      }
    }

    // Clear tokens from cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

// Check if user is authenticated
export const checkIfUserAuthenticated = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  const token = accessToken || refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    let decoded;
    if (accessToken) {
      decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } else if (refreshToken) {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return res
        .status(401)
        .json({ message: "No access token, need to refresh." });
    } else {
      return res.status(401).json({ message: "No token provided" });
    }

    const user = await User.findById(decoded.id).select("-password +role");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User is authenticated" });
  } catch (error) {
    console.error("Authentication Error:", error);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Server error during authentication" });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  const blackListedRefresh = await BlacklistedToken.findOne({
    token: refreshToken,
  });
  if (blackListedRefresh) {
    return res.status(401).json({ message: "Refresh token is blacklisted." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id).select("-password +role");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({ message: "Access token refreshed" });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    res.status(500).json({ message: "Server error during token refresh" });
  }
};
