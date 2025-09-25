import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getBootstrapData } from "../controllers/bootstrapController.js";

const router = Router();

// User Routes
router.get("/get", protect, asyncHandler(getBootstrapData)); // Gets all exercises

export default router;
