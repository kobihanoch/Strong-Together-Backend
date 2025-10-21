import { Router } from "express";
import { withRlsTx } from "../config/db.js";
import {
  createOrSignInWithApple,
  createOrSignInWithGoogle,
  proceedLogin,
} from "../controllers/oauthController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";
import dpopValidationMiddleware from "../middlewares/DPoPValidationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// No authentication required
router.post(
  "/apple",
  loginLimiter,
  asyncHandler(withRlsTx(createOrSignInWithApple))
); // Logging in a user and returns tokens and user id

router.post(
  "/google",
  loginLimiter,
  asyncHandler(withRlsTx(createOrSignInWithGoogle))
); // Logging in a user and returns tokens and user id

// User routes
router.post(
  "/proceedauth",
  loginLimiter,
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(proceedLogin))
); // Logging in a user and returns user

export default router;
