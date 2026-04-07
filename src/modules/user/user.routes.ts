import { Router } from 'express';
import { withRlsTx } from '../../config/db.ts';
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
import { asyncHandler } from '../../middlewares/asyncHandler.ts';
import { protect } from '../../middlewares/authMiddleware.ts';
import dpopValidationMiddleware from '../../middlewares/DPoPValidationMiddleware.ts';
import { updateUserLimiter, updateUserLimiterDaily } from '../../middlewares/rateLimiter.ts';
import { uploadImage } from '../../middlewares/uploadImage.ts';
import { validate } from '../../middlewares/validateRequest.ts';
import { createUserRequest } from './create/create.schemas.ts';
import { deleteProfilePicRequest, updateUserRequest } from './update/update.schemas.ts';
import { saveUserPushTokenRequest } from './push-tokens/push-tokens.schemas.ts';

const router = Router();

// Public routes
router.post('/create', validate(createUserRequest), asyncHandler(createUser)); // Public - Create a new user (registration)

// User routes
router.get('/get', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(getAuthenticatedUserById))); // User - Get their own profile
router.put(
  '/updateself',
  updateUserLimiterDaily,
  updateUserLimiter,
  dpopValidationMiddleware,
  protect,
  validate(updateUserRequest),
  asyncHandler(withRlsTx(updateAuthenticatedUser)),
); // Update self user
router.put(
  '/pushtoken',
  dpopValidationMiddleware,
  protect,
  validate(saveUserPushTokenRequest),
  asyncHandler(withRlsTx(saveUserPushToken)),
); // User - save push token to DB
router.put(
  '/setprofilepic',
  dpopValidationMiddleware,
  protect,
  uploadImage.single('file'),
  asyncHandler(withRlsTx(setProfilePicAndUpdateDB)),
); // User - Stores profile pic in bucket, and updates user DB to profile pic new URL
router.delete(
  '/deleteprofilepic',
  dpopValidationMiddleware,
  protect,
  validate(deleteProfilePicRequest),
  asyncHandler(withRlsTx(deleteUserProfilePic)),
); // User - Deletes a pic from bucket and from user DB
router.delete('/deleteself', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(deleteSelfUser))); // User -Delete self user
router.get('/changeemail', asyncHandler(withRlsTx(updateSelfEmail))); // User - Update self user

export default router;
