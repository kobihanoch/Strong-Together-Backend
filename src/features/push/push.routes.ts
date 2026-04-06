import { Router } from 'express';
import { sendDailyPush, sendHourlyReminderPush } from './push.controller.ts';
import { withRlsTx } from '../../config/db.ts';
import { asyncHandler } from '../../middlewares/asyncHandler.ts';

const router = Router();

router.get('/daily', asyncHandler(withRlsTx(sendDailyPush))); // Send daily push

router.get('/hourlyreminder', asyncHandler(withRlsTx(sendHourlyReminderPush))); // Send daily push

export default router;
