import { Router } from 'express';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import { getPresignedUrlFromS3 } from './videoAnalysis.controller.ts';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.ts';
import { protect } from '../../shared/middlewares/authMiddleware.ts';
import dpopValidationMiddleware from '../../shared/middlewares/DPoPValidationMiddleware.ts';
import { validate } from '../../shared/middlewares/validateRequest.ts';
import { getPresignedUrlS3Request } from './videoAnalysis.schemas.ts';

const router = Router();

// USER
router.post(
  '/getpresignedurl',
  dpopValidationMiddleware,
  protect,
  validate(getPresignedUrlS3Request),
  asyncHandler(withRlsTx(getPresignedUrlFromS3)),
); // Gets presigned URL from s3

export default router;
