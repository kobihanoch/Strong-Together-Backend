import { Router } from "express";
import { withRlsTx } from "../config/db.js";
import { loginUser } from "../controllers/authController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// No authentication required
router.post("/apple", loginLimiter, asyncHandler(withRlsTx(loginUser))); // Logging in a user and returns user

router.post("/google", loginLimiter, asyncHandler(withRlsTx(loginUser))); // Logging in a user and returns user

export default router;
