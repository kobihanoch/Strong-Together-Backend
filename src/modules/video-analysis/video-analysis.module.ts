import { Router } from 'express';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import { getPresignedUrlFromS3 } from './video-analysis.controller.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../common/guards/authentication.guard.ts';
import { authorize } from '../../common/guards/authorization.guard.ts';
import dpopValidationMiddleware from '../../common/guards/dpop-validation.guard.ts';
import { validate } from '../../common/pipes/validate-request.pipe.ts';
import { getPresignedUrlS3Request } from '@strong-together/shared';

const router = Router();

// USER
router.post(
  '/getpresignedurl',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(getPresignedUrlS3Request),
  asyncHandler(withRlsTx(getPresignedUrlFromS3)),
); // Gets presigned URL from s3

export default router;
