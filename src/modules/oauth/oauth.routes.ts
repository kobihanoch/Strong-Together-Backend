import { Router } from 'express';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import { proceedLogin } from './oauth.controller.ts';
import { createOrSignInWithApple } from './apple/apple.controller.ts';
import { createOrSignInWithGoogle } from './google/google.controller.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { loginLimiter } from '../../shared/middlewares/rate-limiter.ts';
import dpopValidationMiddleware from '../../shared/middlewares/dpop-validation-middleware.ts';
import { protect } from '../../shared/middlewares/auth-middleware.ts';
import { validate } from '../../shared/middlewares/validate-request.ts';
import { appleOAuthRequest } from './apple/apple.schemas.ts';
import { googleOAuthRequest } from './google/google.schemas.ts';

const router = Router();

// No authentication required
router.post('/apple', loginLimiter, validate(appleOAuthRequest), asyncHandler(withRlsTx(createOrSignInWithApple))); // Logging in a user and returns tokens and user id

router.post('/google', loginLimiter, validate(googleOAuthRequest), asyncHandler(withRlsTx(createOrSignInWithGoogle))); // Logging in a user and returns tokens and user id

// User routes
router.post('/proceedauth', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(proceedLogin))); // Logging in a user and returns user

export default router;
