import { Router } from 'express';
import { getAnalytics } from './analytics.controller.ts';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.ts';
import { protect } from '../../shared/middlewares/authMiddleware.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../shared/middlewares/DPoPValidationMiddleware.ts';

const router = Router();

// User
router.get('/get', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(getAnalytics))); // Get user's analytics

export default router;
