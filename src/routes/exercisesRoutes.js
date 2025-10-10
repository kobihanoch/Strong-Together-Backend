import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllExercises } from "../controllers/exercisesController.js";
import { withRlsTx } from "../config/db.js";

const router = Router();

// User Routes
router.get("/getall", protect, asyncHandler(withRlsTx(getAllExercises))); // Gets all exercises

export default router;
