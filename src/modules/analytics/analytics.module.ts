import { Router } from 'express';
import { getAnalytics } from './analytics.controller.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../common/guards/authentication.ts';
import { authorize } from '../../shared/middlewares/authorization.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../shared/middlewares/dpop-validation-middleware.ts';

const router = Router();

// User
router.get('/get', dpopValidationMiddleware, authenticate, authorize('user'), asyncHandler(withRlsTx(getAnalytics))); // Get user's analytics

export default router;
