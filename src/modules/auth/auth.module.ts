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
import dpopValidationMiddleware from '../../common/guards/dpop-validation.guard.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../common/guards/authentication.guard.ts';
import { authorize } from '../../common/guards/authorization.guard.ts';
import {
  changeVerificationEmailLimiter,
  changeVerificationEmailLimiterDaily,
  loginIpLimiter,
  loginLimiter,
  resetPasswordEmailLimiter,
  restPasswordEmailLimiterDaily,
} from '../../common/guards/rate-limit.guard.ts';
import { validate } from '../../common/pipes/validate-request.pipe.ts';
import {
  changeEmailAndVerifyRequest,
  checkUserVerifyRequest,
  sendVerificationMailRequest,
  verifyAccountRequest,
} from '@strong-together/shared';
import { loginRequest, resetPasswordRequest, sendChangePassEmailRequest } from '@strong-together/shared';

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
router.post('/logout', dpopValidationMiddleware, authenticate, authorize('user'), asyncHandler(withRlsTx(logoutUser))); // Logging out a user

export default router;
