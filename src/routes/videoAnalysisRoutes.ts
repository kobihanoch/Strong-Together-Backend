import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { protect } from '../middlewares/authMiddleware.ts';
import { withRlsTx } from '../config/db.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';
import { getPresignedUrlFromS3, publishVideoAnalysisJob } from '../controllers/videoAnalysisController.ts';
import { validate } from '../middlewares/validateRequest.ts';
import { getPresignedUrlS3Request } from '../validators/videoAnalysis/getPresignedUrlFromS3Request.schema.ts';
import { publishVideoAnalysisJobRequest } from '../validators/videoAnalysis/publishVideoAnalysisJobRequest.schema.ts';

const router = Router();

// USER
router.post(
  '/getpresignedurl',
  dpopValidationMiddleware,
  protect,
  validate(getPresignedUrlS3Request),
  asyncHandler(withRlsTx(getPresignedUrlFromS3)),
); // Gets presigned URL from s3
router.post(
  '/publishjob',
  dpopValidationMiddleware,
  protect,
  validate(publishVideoAnalysisJobRequest),
  asyncHandler(withRlsTx(publishVideoAnalysisJob)),
); // Publish job to redis

export default router;
