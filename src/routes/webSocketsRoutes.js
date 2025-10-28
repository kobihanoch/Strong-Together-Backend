import { Router } from "express";
import { generateTicket } from "../controllers/webSocketsController.js";
import dpopValidationMiddleware from "../middlewares/DPoPValidationMiddleware.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// User routes
router.post(
  "/generateticket",
  dpopValidationMiddleware,
  protect,
  asyncHandler(generateTicket)
); // User - creates a ws ticket

export default router;
