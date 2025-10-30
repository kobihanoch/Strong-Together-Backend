import { Router } from "express";
import {
  createUser,
  deleteSelfUser,
  deleteUserProfilePic,
  getAuthenticatedUserById,
  saveUserPushToken,
  setProfilePicAndUpdateDB,
  updateAuthenticatedUser,
  updateSelfEmail,
} from "../controllers/userController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../middlewares/uploadImage.js";
import { validate } from "../middlewares/validateRequest.js";
import { registerSchema } from "../validators/auth/register.schema.js";
import { updateUserSchema } from "../validators/update/updateUser.schema.js";
import { withRlsTx } from "../config/db.js";
import dpopValidationMiddleware from "../middlewares/DPoPValidationMiddleware.js";
import {
  updateUserLimiter,
  updateUserLimiterDaily,
} from "../middlewares/rateLimiter.js";

const router = Router();

// Public routes
router.post("/create", validate(registerSchema), asyncHandler(createUser)); // Public - Create a new user (registration)

// User routes
router.get(
  "/get",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(getAuthenticatedUserById))
); // User - Get their own profile
router.put(
  "/update",
  updateUserLimiterDaily,
  updateUserLimiter,
  dpopValidationMiddleware,
  protect,
  validate(updateUserSchema),
  asyncHandler(withRlsTx(updateAuthenticatedUser))
);
router.put(
  "/pushtoken",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(saveUserPushToken))
); // User - save push token to DB
router.put(
  "/setprofilepic",
  dpopValidationMiddleware,
  protect,
  uploadImage.single("file"),
  asyncHandler(withRlsTx(setProfilePicAndUpdateDB))
); // User - Stores profile pic in bucket, and updates user DB to profile pic new URL
router.delete(
  "/deleteprofilepic",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(deleteUserProfilePic))
); // User - Deletes a pic from bucket and from user DB
router.delete(
  "/deleteself",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(deleteSelfUser))
); // User -Delete self user
router.put(
  "/updateself",
  dpopValidationMiddleware,
  protect,
  validate(updateUserSchema),
  asyncHandler(withRlsTx(updateAuthenticatedUser))
); // User - Update self user
router.get("/changeemail", asyncHandler(withRlsTx(updateSelfEmail))); // User - Update self user

export default router;
