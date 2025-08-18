import { Router } from "express";
import { sendDailyPush } from "../controllers/pushController.js";

const router = Router();

router.get("/daily", sendDailyPush); // Send daily push

export default router;
