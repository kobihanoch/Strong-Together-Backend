import { Router } from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.ts';
import { protect } from '../../middlewares/authMiddleware.ts';
import { getBootstrapData } from './bootstrap.controller.ts';
import { withRlsTx } from '../../config/db.ts';
import dpopValidationMiddleware from '../../middlewares/DPoPValidationMiddleware.ts';
import { bootstrapRequest } from './bootstrapRequest.schema.ts';
import { validate } from '../../middlewares/validateRequest.ts';

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
