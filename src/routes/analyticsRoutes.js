import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { withRlsTx } from "../config/db.js";
import dpopValidationMiddleware from "../middlewares/DPoPValidationMiddleware.js";

const router = Router();

// User
router.get(
  "/get",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(getAnalytics))
); // Get user's analytics

export default router;
