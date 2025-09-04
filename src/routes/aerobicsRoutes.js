import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addUserAerobics,
  getUserAerobics,
} from "../controllers/aerobicsController.js";

const router = new Router();

// USER
router.get("/get", protect, asyncHandler(getUserAerobics)); // Gets user's aerobics (45 days)
router.post("/add", protect, asyncHandler(addUserAerobics)); // Adds an aerobics activity for user

export default router;
