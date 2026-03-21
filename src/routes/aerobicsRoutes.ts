import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { protect } from '../middlewares/authMiddleware.ts';
import { addUserAerobics, getUserAerobics } from '../controllers/aerobicsController.ts';
import { withRlsTx } from '../config/db.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';

const router = Router();

// USER
router.get('/get', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(getUserAerobics))); // Gets user's aerobics (45 days)
router.post('/add', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(addUserAerobics))); // Adds an aerobics activity for user

export default router;
