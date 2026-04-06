import { Request, Response } from 'express';
import { createLogger } from '../config/logger.ts';
import { sendDailyPushData, sendHourlyReminderPushData } from '../services/pushService.ts';

const logger = createLogger('controller:push');

/**
 * Enqueue the daily push-notification batch.
 *
 * Triggers the daily notification flow and returns a summary of the enqueue
 * operation.
 *
 * Route: GET /api/push/daily
 * Access: Public
 */
export const sendDailyPush = async (req: Request, res: Response): Promise<void> => {
  const requestLogger = req.logger || logger;

  try {
    const payload = await sendDailyPushData(req.requestId);
    res.json({ success: payload.success, message: payload.message });
  } catch (error) {
    if (error instanceof Error) {
      requestLogger.error(
        { err: error, event: 'push.daily_enqueue_failed' },
        'Failed to enqueue daily notifications',
      );
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

/**
 * Enqueue the hourly workout-reminder push batch.
 *
 * Calculates per-user reminder timing and enqueues reminder notifications for
 * users whose next workout reminder is due.
 *
 * Route: GET /api/push/hourlyreminder
 * Access: Public
 */
export const sendHourlyReminderPush = async (req: Request, res: Response): Promise<void> => {
  const requestLogger = req.logger || logger;

  try {
    const payload = await sendHourlyReminderPushData(req.requestId);
    res.json({
      success: payload.success,
      message: payload.message,
    });
  } catch (error) {
    if (error instanceof Error) {
      requestLogger.error(
        { err: error, event: 'push.hourly_enqueue_failed' },
        'Failed to enqueue hourly reminders',
      );
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
