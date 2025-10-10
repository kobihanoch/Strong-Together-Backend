import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getBootstrapData } from "../controllers/bootstrapController.js";
import { withRlsTx } from "../config/db.js";

const router = Router();

// User Routes
router.get("/get", protect, asyncHandler(withRlsTx(getBootstrapData))); // Gets all exercises

export default router;
