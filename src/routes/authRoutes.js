import { Router } from "express";
import {
  checkAuthAndRefresh,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/authController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateRequest.js";
import { loginSchema } from "../validators/auth/login.schema.js";

const router = Router();

// User Routes
router.post("/login", validate(loginSchema), asyncHandler(loginUser)); // Logging in a user and returns user
router.post("/logout", asyncHandler(logoutUser)); // Logging out a user
router.get("/checkauth", asyncHandler(checkAuthAndRefresh)); // Check if user is authenticated
router.post("/refresh", asyncHandler(refreshAccessToken)); // Refresh token

export default router;
