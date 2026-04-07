import { Router } from 'express';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.ts';
import { protect } from '../../shared/middlewares/authMiddleware.ts';
import { getAllExercises } from './exercises.controller.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import dpopValidationMiddleware from '../../shared/middlewares/DPoPValidationMiddleware.ts';

const router = Router();

// User Routes
router.get('/getall', dpopValidationMiddleware, protect, asyncHandler(withRlsTx(getAllExercises))); // Gets all exercises

export default router;
