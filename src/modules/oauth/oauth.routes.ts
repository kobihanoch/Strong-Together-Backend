import { Router } from 'express';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { loginLimiter } from '../../shared/middlewares/rate-limiter.ts';
import { validate } from '../../shared/middlewares/validate-request.ts';
import { createOrSignInWithApple } from './apple/apple.controller.ts';
import { appleOAuthRequest } from '@strong-together/shared';
import { createOrSignInWithGoogle } from './google/google.controller.ts';
import { googleOAuthRequest } from '@strong-together/shared';

const router = Router();

// No authentication required
router.post('/apple', loginLimiter, validate(appleOAuthRequest), asyncHandler(withRlsTx(createOrSignInWithApple))); // Logging in a user and returns tokens and user id

router.post('/google', loginLimiter, validate(googleOAuthRequest), asyncHandler(withRlsTx(createOrSignInWithGoogle))); // Logging in a user and returns tokens and user id

export default router;
