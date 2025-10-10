import { Router } from "express";
import {
  deleteMessage,
  getAllUserMessages,
  markUserMessageAsRead,
} from "../controllers/messageController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { withRlsTx } from "../config/db.js";

const router = Router();

// User Routes
router.get(
  "/getmessages",
  protect,
  asyncHandler(withRlsTx(getAllUserMessages))
); // Gets user messages
router.put(
  "/markasread/:id",
  protect,
  asyncHandler(withRlsTx(markUserMessageAsRead))
); // Gets user messages
router.delete("/delete/:id", protect, asyncHandler(withRlsTx(deleteMessage))); // Deletes a user's message

export default router;
