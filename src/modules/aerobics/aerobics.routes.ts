import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.ts';
import { protect } from '../../shared/middlewares/authMiddleware.ts';
import { addUserAerobics, getUserAerobics } from './aerobics.controller.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../shared/middlewares/DPoPValidationMiddleware.ts';
import { validate } from '../../shared/middlewares/validateRequest.ts';
import { getAerobicsRequest, addAerobicsRequest } from './aerobics.schemas.ts';

const router = Router();

// USER
router.get(
  '/get',
  dpopValidationMiddleware,
  protect,
  validate(getAerobicsRequest),
  asyncHandler(withRlsTx(getUserAerobics)),
); // Gets user's aerobics (45 days)
router.post(
  '/add',
  dpopValidationMiddleware,
  protect,
  validate(addAerobicsRequest),
  asyncHandler(withRlsTx(addUserAerobics)),
); // Adds an aerobics activity for user

export default router;
