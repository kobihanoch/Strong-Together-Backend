import { Router } from "express";
import { withRlsTx } from "../config/db.js";
import { applyProSubAndPayment } from "../controllers/subscriptionsController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import dpopValidationMiddleware from "../middlewares/DPoPValidationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/prosub",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(applyProSubAndPayment))
); // Send daily push

export default router;
