import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.ts';
import { protect } from '../middlewares/authMiddleware.ts';
import { getAllExercises } from '../controllers/exercisesController.ts';
import { withRlsTx } from '../config/db.ts';
import dpopValidationMiddleware from '../middlewares/DPoPValidationMiddleware.ts';

const router = Router();

// User Routes
router.get('/getall', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(getAllExercises))); // Gets all exercises

export default router;
