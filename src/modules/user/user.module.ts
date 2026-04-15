import { Router } from 'express';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import {
  getAuthenticatedUserById,
  setProfilePicAndUpdateDB,
  updateAuthenticatedUser,
  updateSelfEmail,
  deleteSelfUser,
  deleteUserProfilePic,
} from './update/update.controller.ts';
import { createUser } from './create/create.controller.ts';
import { saveUserPushToken } from './push-tokens/push-tokens.controller.ts';
import { asyncHandler } from '../../shared/middlewares/async-handler.ts';
import { authenticate } from '../../common/guards/authentication.guard.ts';
import { authorize } from '../../common/guards/authorization.guard.ts';
import dpopValidationMiddleware from '../../common/guards/dpop-validation.guard.ts';
import { updateUserLimiter, updateUserLimiterDaily } from '../../common/guards/rate-limit.guard.ts';
import { uploadImage } from '../../shared/middlewares/upload-image.ts';
import { validate } from '../../common/pipes/validate-request.pipe.ts';
import {
  createUserRequest,
  deleteProfilePicRequest,
  updateUserRequest,
  saveUserPushTokenRequest,
} from '@strong-together/shared';

const router = Router();

// Public routes
router.post('/create', validate(createUserRequest), asyncHandler(createUser)); // Public - Create a new user (registration)

// User routes
router.get(
  '/get',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  asyncHandler(withRlsTx(getAuthenticatedUserById)),
); // User - Get their own profile
router.put(
  '/updateself',
  updateUserLimiterDaily,
  updateUserLimiter,
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(updateUserRequest),
  asyncHandler(withRlsTx(updateAuthenticatedUser)),
); // Update self user
router.put(
  '/pushtoken',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(saveUserPushTokenRequest),
  asyncHandler(withRlsTx(saveUserPushToken)),
); // User - save push token to DB
router.put(
  '/setprofilepic',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  uploadImage.single('file'),
  asyncHandler(withRlsTx(setProfilePicAndUpdateDB)),
); // User - Stores profile pic in bucket, and updates user DB to profile pic new URL
router.delete(
  '/deleteprofilepic',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  validate(deleteProfilePicRequest),
  asyncHandler(withRlsTx(deleteUserProfilePic)),
); // User - Deletes a pic from bucket and from user DB
router.delete(
  '/deleteself',
  dpopValidationMiddleware,
  authenticate,
  authorize('user'),
  asyncHandler(withRlsTx(deleteSelfUser)),
); // User -Delete self user
router.get('/changeemail', asyncHandler(withRlsTx(updateSelfEmail))); // User - Update self user

export default router;
