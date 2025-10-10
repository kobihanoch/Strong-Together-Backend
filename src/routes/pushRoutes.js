import { Router } from "express";
import { sendDailyPush } from "../controllers/pushController.js";
import { withRlsTx } from "../config/db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.get("/daily", asyncHandler(withRlsTx(sendDailyPush))); // Send daily push

export default router;
