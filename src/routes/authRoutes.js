import { Router } from "express";
import {
  changeEmailAndVerify,
  checkUserVerify,
  loginUser,
  logoutUser,
  refreshAccessToken,
  resetPassword,
  sendChangePassEmail,
  sendVerificationMail,
  verifyUserAccount,
} from "../controllers/authController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  changeVerificationEmailLimiter,
  changeVerificationEmailLimiterDaily,
  loginLimiter,
  resetPasswordEmailLimiter,
  restPasswordEmailLimiterDaily,
} from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validateRequest.js";
import { changeEmailSchema } from "../validators/auth/changeemail.schema.js";
import { loginSchema } from "../validators/auth/login.schema.js";
import { resetPasswordSchema } from "../validators/auth/resetpassword.schema.js";
import { withRlsTx } from "../config/db.js";
import dpopValidationMiddleware from "../middlewares/DPoPValidationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// No authentication required
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  asyncHandler(withRlsTx(loginUser))
); // Logging in a user and returns user
router.post(
  "/refresh",
  dpopValidationMiddleware,
  asyncHandler(withRlsTx(refreshAccessToken))
); // Refresh token

router.get("/verify", asyncHandler(withRlsTx(verifyUserAccount))); // Verification mail button url (to verify user)
router.post(
  "/sendverificationemail",
  changeVerificationEmailLimiterDaily,
  changeVerificationEmailLimiter,
  asyncHandler(withRlsTx(sendVerificationMail))
); // Send verification email
router.put(
  "/changeemailverify",
  changeVerificationEmailLimiterDaily,
  changeVerificationEmailLimiter,
  validate(changeEmailSchema),
  asyncHandler(withRlsTx(changeEmailAndVerify))
); // Change email
router.get("/checkuserverify", asyncHandler(withRlsTx(checkUserVerify))); // Check if user verified

router.post(
  "/forgotpassemail",
  restPasswordEmailLimiterDaily,
  resetPasswordEmailLimiter,
  asyncHandler(withRlsTx(sendChangePassEmail))
); // Send change password email
router.put(
  "/resetpassword",
  validate(resetPasswordSchema),
  asyncHandler(withRlsTx(resetPassword))
); // Reset password

// User routes
router.post(
  "/logout",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(logoutUser))
); // Logging out a user

export default router;
