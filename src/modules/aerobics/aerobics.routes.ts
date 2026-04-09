import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { protect } from '../../shared/middlewares/auth-middleware.ts';
import { addUserAerobics, getUserAerobics } from './aerobics.controller.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../shared/middlewares/dpop-validation-middleware.ts';
import { validate } from '../../shared/middlewares/validate-request.ts';
import { getAerobicsRequest, addAerobicsRequest } from '@strong-together/shared';

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
