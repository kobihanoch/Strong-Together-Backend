import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getAuthenticatedUserById,
  updateAuthenticatedUser,
  updateUser,
  deleteUser,
  getUserById,
} from "../controllers/userController.js";
import { protect, protectAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.post("/create", createUser); // Public - Create a new user (registration)

// User routes
router.get("/get", protect, getAuthenticatedUserById); // User - Get their own profile
router.put("/update", protect, updateAuthenticatedUser); // User - Update their own profile

// Admin routes
router.get("/all", protectAdmin, getAllUsers); // Admin - Get all users
router.get("/:id", protectAdmin, getUserById); // Admin - Get a specific user by ID
router.put("/update/:id", protectAdmin, updateUser); // Admin - Update a specific user by ID
router.delete("/delete/:id", protectAdmin, deleteUser); // Admin - Delete a specific user by ID

export default router;
