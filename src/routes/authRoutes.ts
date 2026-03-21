import { Router } from 'express';
import { withRlsTx } from '../config/db.ts';
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
} from '../controllers/authController.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { protect } from '../middlewares/authMiddleware.ts';
import {
  changeVerificationEmailLimiter,
  changeVerificationEmailLimiterDaily,
  loginIpLimiter,
  loginLimiter,
  resetPasswordEmailLimiter,
  restPasswordEmailLimiterDaily,
} from '../middlewares/rateLimiter.ts';
import { validate } from '../middlewares/validateRequest.ts';
import { changeEmailAndVerifyRequest } from '../validators/auth/changeEmailAndVerifyRequest.schema.ts';
import { checkUserVerifyRequest } from '../validators/auth/checkUserVerifyRequest.schema.ts';
import { loginRequest } from '../validators/auth/loginRequest.schema.ts';
import { resetPasswordRequest } from '../validators/auth/resetPasswordRequest.schema.ts';
import { sendChangePassEmailRequest } from '../validators/auth/sendChangePassEmailRequest.schema.ts';
import { sendVerificationMailRequest } from '../validators/auth/sendVerificationMailRequest.schema.ts';
import { verifyAccountRequest } from '../validators/auth/verifyUserAccountRequest.schema.ts';

const router = Router();

// No authentication required
router.post('/login', loginLimiter, loginIpLimiter, validate(loginRequest), asyncHandler(withRlsTx(loginUser))); // Logging in a user and returns user
router.post('/refresh', dpopValidationMiddleware, asyncHandler(withRlsTx(refreshAccessToken))); // Refresh token

router.get('/verify', validate(verifyAccountRequest), asyncHandler(withRlsTx(verifyUserAccount))); // Verification mail button url (to verify user)
router.post(
  '/sendverificationemail',
  changeVerificationEmailLimiterDaily,
  changeVerificationEmailLimiter,
  validate(sendVerificationMailRequest),
  asyncHandler(withRlsTx(sendVerificationMail)),
); // Send verification email
router.put(
  '/changeemailverify',
  changeVerificationEmailLimiterDaily,
  changeVerificationEmailLimiter,
  validate(changeEmailAndVerifyRequest),
  asyncHandler(withRlsTx(changeEmailAndVerify)),
); // Change email
router.get('/checkuserverify', validate(checkUserVerifyRequest), asyncHandler(withRlsTx(checkUserVerify))); // Check if user verified

router.post(
  '/forgotpassemail',
  restPasswordEmailLimiterDaily,
  resetPasswordEmailLimiter,
  validate(sendChangePassEmailRequest),
  asyncHandler(withRlsTx(sendChangePassEmail)),
); // Send change password email
router.put('/resetpassword', validate(resetPasswordRequest), asyncHandler(withRlsTx(resetPassword))); // Reset password

// User routes
router.post('/logout', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(logoutUser))); // Logging out a user

export default router;
