import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// User
router.get("/get", protect, asyncHandler(getAnalytics)); // Get user's analytics

export default router;
