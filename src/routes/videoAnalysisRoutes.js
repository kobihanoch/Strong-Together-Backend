import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { protect } from "../middlewares/authMiddleware.js";
import { withRlsTx } from "../config/db.js";
import dpopValidationMiddleware from "../middlewares/DPoPValidationMiddleware.js";
import {
  getPresignedUrlFromS3,
  publishVideoAnalysisJob,
} from "../controllers/videoAnalysisController.js";

const router = new Router();

// USER
router.get(
  "/getpresignedurl",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(getPresignedUrlFromS3)),
); // Gets presigned URL from s3
router.post(
  "/publishjob",
  dpopValidationMiddleware,
  protect,
  asyncHandler(withRlsTx(publishVideoAnalysisJob)),
); // Publish job to redis

export default router;
