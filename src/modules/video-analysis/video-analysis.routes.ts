import { Router } from 'express';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import { getPresignedUrlFromS3 } from './video-analysis.controller.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../shared/middlewares/authentication.ts';
import { authorize } from '../../shared/middlewares/authorization.ts';
import dpopValidationMiddleware from '../../shared/middlewares/dpop-validation-middleware.ts';
import { validate } from '../../shared/middlewares/validate-request.ts';
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
