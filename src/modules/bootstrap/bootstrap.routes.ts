import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.ts';
import { protect } from '../../shared/middlewares/authMiddleware.ts';
import { getBootstrapData } from './bootstrap.controller.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../shared/middlewares/DPoPValidationMiddleware.ts';
import { bootstrapRequest } from './bootstrap.schemas.ts';
import { validate } from '../../shared/middlewares/validateRequest.ts';

const router = Router();

// User Routes
router.get(
  '/get',
  dpopValidationMiddleware,
  protect,
  validate(bootstrapRequest),
  asyncHandler(withRlsTx(getBootstrapData)),
); // Gets all exercises

export default router;
