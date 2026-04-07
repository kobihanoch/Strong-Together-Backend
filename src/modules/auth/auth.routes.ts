import { Router } from 'express';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import {
  changeEmailAndVerify,
  checkUserVerify,
  sendVerificationMail,
  verifyUserAccount,
} from './verification/verification.controller.ts';
import { loginUser, logoutUser, refreshAccessToken } from './session/session.controller.ts';
import { resetPassword, sendChangePassEmail } from './password/password.controller.ts';
import dpopValidationMiddleware from '../../shared/middlewares/dpop-validation-middleware.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { protect } from '../../shared/middlewares/auth-middleware.ts';
import {
  changeVerificationEmailLimiter,
  changeVerificationEmailLimiterDaily,
  loginIpLimiter,
  loginLimiter,
  resetPasswordEmailLimiter,
  restPasswordEmailLimiterDaily,
} from '../../shared/middlewares/rate-limiter.ts';
import { validate } from '../../shared/middlewares/validate-request.ts';
import {
  changeEmailAndVerifyRequest,
  checkUserVerifyRequest,
  sendVerificationMailRequest,
  verifyAccountRequest,
} from './verification/verification.schemas.ts';
import { loginRequest } from './session/session.schemas.ts';
import { resetPasswordRequest, sendChangePassEmailRequest } from './password/password.schemas.ts';

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
