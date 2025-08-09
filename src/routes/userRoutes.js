import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  createUser,
  getAllUsers,
  getAuthenticatedUserById,
  updateAuthenticatedUser,
  updateUser,
  deleteUser,
  getUserById,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validateRequest.js";
import { registerSchema } from "../validators/auth/register.schema.js";
import { updateUserSchema } from "../validators/update/updateUser.schema.js";

const router = Router();

// Public routes
router.post("/create", validate(registerSchema), asyncHandler(createUser)); // Public - Create a new user (registration)

// User routes
router.get("/get", protect, asyncHandler(getAuthenticatedUserById)); // User - Get their own profile
router.put(
  "/update",
  protect,
  validate(updateUserSchema),
  asyncHandler(updateAuthenticatedUser)
); // User - Update their own profile

// Admin routes
//router.get("/all", protect, authorizeRoles("admin"), asyncHandler(getAllUsers)); // Admin - Get all users
//router.get("/:id", protect, authorizeRoles("admin"), asyncHandler(getUserById)); // Admin - Get a specific user by ID
/*router.put(
  "/update/:id",
  protect,
  authorizeRoles("admin"),
  validate(editUserSchema),
  asyncHandler(updateUser)
); // Admin - Update a specific user by ID*/
/*router.delete(
  "/delete/:id",
  protect,
  authorizeRoles("admin"),
  asyncHandler(deleteUser)
); // Admin - Delete a specific user by ID*/

export default router;
