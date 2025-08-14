import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllExercises } from "../controllers/exercisesController.js";

const router = Router();

// User Routes
router.get("/getall", protect, asyncHandler(getAllExercises)); // Gets all exercises

export default router;
