import { Router } from 'express';
import { withRlsTx } from '../config/db.ts';
import { createOrSignInWithApple, createOrSignInWithGoogle, proceedLogin } from '../controllers/oauthController.ts';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { loginLimiter } from '../middlewares/rateLimiter.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';
import { protect } from '../middlewares/authMiddleware.ts';

const router = Router();

// No authentication required
router.post('/apple', loginLimiter, asyncHandler(withRlsTx(createOrSignInWithApple))); // Logging in a user and returns tokens and user id

router.post('/google', loginLimiter, asyncHandler(withRlsTx(createOrSignInWithGoogle))); // Logging in a user and returns tokens and user id

// User routes
router.post('/proceedauth', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(proceedLogin))); // Logging in a user and returns user

export default router;
