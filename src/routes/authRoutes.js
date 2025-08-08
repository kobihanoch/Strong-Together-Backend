import { Router } from "express";
import {
  loginUser,
  logoutUser,
  checkIfUserAuthenticated,
  refreshToken,
} from "../controllers/authController.js";

const router = Router();

// User Routes
router.post("/login", loginUser); // Logging in a user
router.post("/logout", logoutUser); // Logging out a user
router.get("/checkauth", checkIfUserAuthenticated); // Check if user is authenticated
router.post("/refresh", refreshToken); // Refresh token

export default router;
