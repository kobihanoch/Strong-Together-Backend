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
  resetPasswordEmailLimiter,
  restPasswordEmailLimiterDaily,
} from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validateRequest.js";
import { changeEmailSchema } from "../validators/auth/changeemail.schema.js";
import { loginSchema } from "../validators/auth/login.schema.js";
import { resetPasswordSchema } from "../validators/auth/resetpassword.schema.js";

const router = Router();

// No authentication required
router.post("/login", validate(loginSchema), asyncHandler(loginUser)); // Logging in a user and returns user
router.post("/refresh", asyncHandler(refreshAccessToken)); // Refresh token
router.post("/logout", asyncHandler(logoutUser)); // Logging out a user
router.get("/verify", asyncHandler(verifyUserAccount)); // Verification mail button url (to verify user)
router.post(
  "/sendverificationemail",
  changeVerificationEmailLimiterDaily,
  changeVerificationEmailLimiter,
  asyncHandler(sendVerificationMail)
); // Send verification email
router.put(
  "/changeemailverify",
  changeVerificationEmailLimiterDaily,
  changeVerificationEmailLimiter,
  validate(changeEmailSchema),
  asyncHandler(changeEmailAndVerify)
); // Change email
router.get("/checkuserverify", asyncHandler(checkUserVerify)); // Check if user verified

router.post(
  "/forgotpassemail",
  restPasswordEmailLimiterDaily,
  resetPasswordEmailLimiter,
  asyncHandler(sendChangePassEmail)
); // Send change password email
router.put(
  "/resetpassword",
  validate(resetPasswordSchema),
  asyncHandler(resetPassword)
); // Reset password

export default router;
