import { Router } from "express";
import { withRlsTx } from "../config/db.js";
import {
  createOrSignInWithApple,
  createOrSignInWithGoogle,
} from "../controllers/oauthController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// No authentication required
router.post(
  "/apple",
  loginLimiter,
  asyncHandler(withRlsTx(createOrSignInWithApple))
); // Logging in a user and returns user

router.post(
  "/google",
  loginLimiter,
  asyncHandler(withRlsTx(createOrSignInWithGoogle))
); // Logging in a user and returns user

export default router;
