import { Router } from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.ts';
import { protect } from '../../middlewares/authMiddleware.ts';
import { addUserAerobics, getUserAerobics } from './aerobics.controller.ts';
import { withRlsTx } from '../../config/db.ts';
import dpopValidationMiddleware from '../../middlewares/DPoPValidationMiddleware.ts';
import { validate } from '../../middlewares/validateRequest.ts';
import { getAerobicsRequest } from './getUserAerobicsRequest.schema.ts';
import { addAerobicsRequest } from './addUserAerobicsRequest.schema.ts';

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
