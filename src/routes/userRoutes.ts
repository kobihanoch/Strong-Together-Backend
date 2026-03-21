import { Router } from 'express';
import {
  createUser,
  deleteSelfUser,
  deleteUserProfilePic,
  getAuthenticatedUserById,
  saveUserPushToken,
  setProfilePicAndUpdateDB,
  updateAuthenticatedUser,
  updateSelfEmail,
} from '../controllers/userController.ts';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { protect } from '../middlewares/authMiddleware.ts';
import { uploadImage } from '../middlewares/uploadImage.ts';
import { validate } from '../middlewares/validateRequest.ts';
import { registerSchema } from '../validators/auth/register.schema.ts';
import { updateUserSchema } from '../validators/update/updateUser.schema.ts';
import { withRlsTx } from '../config/db.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';
import { updateUserLimiter, updateUserLimiterDaily } from '../middlewares/rateLimiter.ts';

const router = Router();

// Public routes
router.post('/create', validate(registerSchema), asyncHandler(createUser)); // Public - Create a new user (registration)

// User routes
router.get('/get', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(getAuthenticatedUserById))); // User - Get their own profile
router.put(
  '/update',
  updateUserLimiterDaily,
  updateUserLimiter,
  dpopValidationMiddleware,
  protect,
  validate(updateUserSchema),
  asyncHandler(withRlsTx(updateAuthenticatedUser)),
);
router.put('/pushtoken', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(saveUserPushToken))); // User - save push token to DB
router.put(
  '/setprofilepic',
  dpopValidationMiddleware,
  protect,
  uploadImage.single('file'),
  asyncHandler(withRlsTx(setProfilePicAndUpdateDB)),
); // User - Stores profile pic in bucket, and updates user DB to profile pic new URL
router.delete('/deleteprofilepic', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(deleteUserProfilePic))); // User - Deletes a pic from bucket and from user DB
router.delete('/deleteself', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(deleteSelfUser))); // User -Delete self user
router.put(
  '/updateself',
  dpopValidationMiddleware,
  protect,
  validate(updateUserSchema),
  asyncHandler(withRlsTx(updateAuthenticatedUser)),
); // User - Update self user
router.get('/changeemail', asyncHandler(withRlsTx(updateSelfEmail))); // User - Update self user

export default router;
