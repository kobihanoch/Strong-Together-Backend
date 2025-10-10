import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addUserAerobics,
  getUserAerobics,
} from "../controllers/aerobicsController.js";
import { withRlsTx } from "../config/db.js";

const router = new Router();

// USER
router.get("/get", protect, asyncHandler(withRlsTx(getUserAerobics))); // Gets user's aerobics (45 days)
router.post("/add", protect, asyncHandler(withRlsTx(addUserAerobics))); // Adds an aerobics activity for user

export default router;
