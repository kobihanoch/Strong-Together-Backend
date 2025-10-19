import { Router } from "express";
import {
  deleteMessage,
  getAllUserMessages,
  markUserMessageAsRead,
} from "../controllers/messageController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { withRlsTx } from "../config/db.js";
import dpopValidationMiddleware from "../middlewares/DPoPValidationMiddleware.js";

const router = Router();

// User Routes
router.get(
  "/getmessages",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(getAllUserMessages))
); // Gets user messages
router.put(
  "/markasread/:id",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(markUserMessageAsRead))
); // Gets user messages
router.delete(
  "/delete/:id",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(deleteMessage))
); // Deletes a user's message

export default router;
