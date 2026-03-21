import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { protect } from '../middlewares/authMiddleware.ts';
import { getBootstrapData } from '../controllers/bootstrapController.ts';
import { withRlsTx } from '../config/db.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';

const router = Router();

// User Routes
router.get('/get', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(getBootstrapData))); // Gets all exercises

export default router;
