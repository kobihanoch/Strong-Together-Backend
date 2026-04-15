import { Router } from 'express';
import { getAnalytics } from './analytics.controller.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../common/guards/authentication.guard.ts';
import { authorize } from '../../common/guards/authorization.guard.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../common/guards/dpop-validation.guard.ts';

const router = Router();

// User
router.get('/get', dpopValidationMiddleware, authenticate, authorize('user'), asyncHandler(withRlsTx(getAnalytics))); // Get user's analytics

export default router;
