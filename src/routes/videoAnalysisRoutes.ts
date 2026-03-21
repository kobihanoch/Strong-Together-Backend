import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { protect } from '../middlewares/authMiddleware.ts';
import { withRlsTx } from '../config/db.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';
import { getPresignedUrlFromS3, publishVideoAnalysisJob } from '../controllers/videoAnalysisController.ts';

const router = Router();

// USER
router.get('/getpresignedurl', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(getPresignedUrlFromS3))); // Gets presigned URL from s3
router.post('/publishjob', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(publishVideoAnalysisJob))); // Publish job to redis

export default router;
