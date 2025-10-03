import { Router } from "express";
import {
  changeEmailAndVerify,
  loginUser,
  logoutUser,
  refreshAccessToken,
  sendVerificationMail,
  verifyUserAccount,
} from "../controllers/authController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validate } from "../middlewares/validateRequest.js";
import { changeEmailSchema } from "../validators/auth/changeemail.schema.js";
import { loginSchema } from "../validators/auth/login.schema.js";
import { changeVerificationEmailLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// No authentication required
router.post("/login", validate(loginSchema), asyncHandler(loginUser)); // Logging in a user and returns user
router.post("/refresh", asyncHandler(refreshAccessToken)); // Refresh token
router.post("/logout", asyncHandler(logoutUser)); // Logging out a user
router.get("/verify", asyncHandler(verifyUserAccount)); // Verification mail
router.post("/sendverificationmail", asyncHandler(sendVerificationMail)); // Send email
router.put(
  "/changeemailverify",
  changeVerificationEmailLimiter,
  validate(changeEmailSchema),
  asyncHandler(changeEmailAndVerify)
); // Change email

export default router;
