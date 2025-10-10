import { Router } from "express";
import {
  createUser,
  deleteSelfUser,
  deleteUserProfilePic,
  getAuthenticatedUserById,
  saveUserPushToken,
  setProfilePicAndUpdateDB,
  updateAuthenticatedUser,
} from "../controllers/userController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../middlewares/uploadImage.js";
import { validate } from "../middlewares/validateRequest.js";
import { registerSchema } from "../validators/auth/register.schema.js";
import { updateUserSchema } from "../validators/update/updateUser.schema.js";
import { withRlsTx } from "../config/db.js";

const router = Router();

// Public routes
router.post("/create", validate(registerSchema), asyncHandler(createUser)); // Public - Create a new user (registration)

// User routes
router.get("/get", protect, asyncHandler(withRlsTx(getAuthenticatedUserById))); // User - Get their own profile
router.put(
  "/update",
  protect,
  validate(updateUserSchema),
  asyncHandler(withRlsTx(updateAuthenticatedUser))
);
router.put("/pushtoken", protect, asyncHandler(withRlsTx(saveUserPushToken))); // User - save push token to DB
router.put(
  "/setprofilepic",
  protect,
  uploadImage.single("file"),
  asyncHandler(withRlsTx(setProfilePicAndUpdateDB))
); // User - Stores profile pic in bucket, and updates user DB to profile pic new URL
router.delete(
  "/deleteprofilepic",
  protect,
  asyncHandler(withRlsTx(deleteUserProfilePic))
); // User - Deletes a pic from bucket and from user DB
router.delete("/deleteself", protect, asyncHandler(withRlsTx(deleteSelfUser))); // User -Delete self user
router.put(
  "/updateself",
  protect,
  validate(updateUserSchema),
  asyncHandler(withRlsTx(updateAuthenticatedUser))
); // User - Update self user

export default router;
