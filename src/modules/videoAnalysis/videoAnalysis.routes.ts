import { Router } from 'express';
import { withRlsTx } from '../../config/db.ts';
import { getPresignedUrlFromS3 } from './videoAnalysis.controller.ts';
import { asyncHandler } from '../../middlewares/asyncHandler.ts';
import { protect } from '../../middlewares/authMiddleware.ts';
import dpopValidationMiddleware from '../../middlewares/DPoPValidationMiddleware.ts';
import { validate } from '../../middlewares/validateRequest.ts';
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
