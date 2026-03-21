import { Router } from 'express';
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
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import {
  changeVerificationEmailLimiter,
  changeVerificationEmailLimiterDaily,
  loginIpLimiter,
  loginLimiter,
  resetPasswordEmailLimiter,
  restPasswordEmailLimiterDaily,
} from '../middlewares/rateLimiter.ts';
import { validate } from '../middlewares/validateRequest.ts';
import { changeEmailSchema } from '../validators/auth/changeemail.schema.ts';
import { loginSchema } from '../validators/auth/login.schema.ts';
import { resetPasswordSchema } from '../validators/auth/resetpassword.schema.ts';
import { withRlsTx } from '../config/db.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';
import { protect } from '../middlewares/authMiddleware.ts';

const router = Router();

// No authentication required
router.post('/login', loginLimiter, loginIpLimiter, validate(loginSchema), asyncHandler(withRlsTx(loginUser))); // Logging in a user and returns user
router.post('/refresh', dpopValidationMiddleware, asyncHandler(withRlsTx(refreshAccessToken))); // Refresh token

router.get('/verify', asyncHandler(withRlsTx(verifyUserAccount))); // Verification mail button url (to verify user)
router.post(
  '/sendverificationemail',
  changeVerificationEmailLimiterDaily,
  changeVerificationEmailLimiter,
  asyncHandler(withRlsTx(sendVerificationMail)),
); // Send verification email
router.put(
  '/changeemailverify',
  changeVerificationEmailLimiterDaily,
  changeVerificationEmailLimiter,
  validate(changeEmailSchema),
  asyncHandler(withRlsTx(changeEmailAndVerify)),
); // Change email
router.get('/checkuserverify', asyncHandler(withRlsTx(checkUserVerify))); // Check if user verified

router.post(
  '/forgotpassemail',
  restPasswordEmailLimiterDaily,
  resetPasswordEmailLimiter,
  asyncHandler(withRlsTx(sendChangePassEmail)),
); // Send change password email
router.put('/resetpassword', validate(resetPasswordSchema), asyncHandler(withRlsTx(resetPassword))); // Reset password

// User routes
router.post('/logout', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(logoutUser))); // Logging out a user

export default router;
