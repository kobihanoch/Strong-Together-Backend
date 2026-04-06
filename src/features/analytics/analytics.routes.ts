import { Router } from 'express';
import { getAnalytics } from './analytics.controller.ts';
import { asyncHandler } from '../../middlewares/asyncHandler.ts';
import { protect } from '../../middlewares/authMiddleware.ts';
import { withRlsTx } from '../../config/db.ts';
import dpopValidationMiddleware from '../../middlewares/DPoPValidationMiddleware.ts';

const router = Router();

// User
router.get('/get', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(getAnalytics))); // Get user's analytics

export default router;
