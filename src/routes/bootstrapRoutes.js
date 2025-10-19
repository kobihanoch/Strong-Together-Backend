import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getBootstrapData } from "../controllers/bootstrapController.js";
import { withRlsTx } from "../config/db.js";
import dpopValidationMiddleware from "../middlewares/DPoPValidationMiddleware.js";

const router = Router();

// User Routes
router.get(
  "/get",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(getBootstrapData))
); // Gets all exercises

export default router;
