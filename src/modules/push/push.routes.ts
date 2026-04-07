import { Router } from 'express';
import { sendDailyPush, sendHourlyReminderPush } from './push.controller.ts';
import { withRlsTx } from '../../infrastructure/db.client.ts';
import { asyncHandler } from '../../shared/middlewares/asyncHandler.ts';

const router = Router();

router.get('/daily', asyncHandler(withRlsTx(sendDailyPush))); // Send daily push

router.get('/hourlyreminder', asyncHandler(withRlsTx(sendHourlyReminderPush))); // Send daily push

export default router;
