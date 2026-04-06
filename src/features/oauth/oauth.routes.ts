import { Router } from 'express';
import { withRlsTx } from '../../config/db.ts';
import { createOrSignInWithApple, createOrSignInWithGoogle, proceedLogin } from './oauth.controller.ts';
import { asyncHandler } from '../../middlewares/asyncHandler.ts';
import { loginLimiter } from '../../middlewares/rateLimiter.ts';
import dpopValidationMiddleware from '../../middlewares/DPoPValidationMiddleware.ts';
import { protect } from '../../middlewares/authMiddleware.ts';
import { validate } from '../../middlewares/validateRequest.ts';
import { appleOAuthRequest } from './appleOAuthRequest.schema.ts';
import { googleOAuthRequest } from './googleOAuthRequest.schema.ts';

const router = Router();

// No authentication required
router.post('/apple', loginLimiter, validate(appleOAuthRequest), asyncHandler(withRlsTx(createOrSignInWithApple))); // Logging in a user and returns tokens and user id

router.post('/google', loginLimiter, validate(googleOAuthRequest), asyncHandler(withRlsTx(createOrSignInWithGoogle))); // Logging in a user and returns tokens and user id

// User routes
router.post('/proceedauth', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(proceedLogin))); // Logging in a user and returns user

export default router;
