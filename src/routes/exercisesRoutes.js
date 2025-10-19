import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllExercises } from "../controllers/exercisesController.js";
import { withRlsTx } from "../config/db.js";
import dpopValidationMiddleware from "../middlewares/DPoPValidationMiddleware.js";

const router = Router();

// User Routes
router.get(
  "/getall",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(getAllExercises))
); // Gets all exercises

export default router;
