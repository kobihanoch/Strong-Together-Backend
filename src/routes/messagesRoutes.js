import { Router } from "express";
import {
  deleteMessage,
  getAllUserMessages,
  markUserMessageAsRead,
} from "../controllers/messageController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// User Routes
router.get("/getmessages", protect, asyncHandler(getAllUserMessages)); // Gets user messages
router.put("/markasread/:id", protect, asyncHandler(markUserMessageAsRead)); // Gets user messages
router.delete("/delete/:id", protect, asyncHandler(deleteMessage)); // Deletes a user's message

export default router;
