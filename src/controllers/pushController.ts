import { Request, Response } from 'express';
import { createLogger } from '../config/logger.ts';
import {
  queryGetAllUsersToSendHourlyReminder,
  queryGetAllUsersWithNotificationsEnabled,
} from '../queries/pushQueries.js';
import { enqueuePushNotifications } from '../queues/pushNotifications/pushNotificationsProducer.ts';
import { NotificationPayload } from '../types/dto/notifications.dto.ts';
import { computeDelayFromUTC } from '../utils/pushUtils.js';

const logger = createLogger('controller:push');

// @desc    Sends daily psuh (outside cron)
// @route   GET /api/push/daily
// @access  Public
export const sendDailyPush = async (req: Request, res: Response): Promise<void> => {
  const users = await queryGetAllUsersWithNotificationsEnabled();
  const requestLogger = req.logger || logger;

  try {
    await enqueuePushNotifications(
      users.map((user) => ({
        token: user.push_token!,
        title: `Hello, ${user.name!.split(' ')[0]}!`,
        body: 'Ready to go workout?',
        delay: 0,
        expiresAt: 0,
        ...(req.requestId ? { requestId: req.requestId } : {}),
      })),
    );

    res.json({ success: true, message: 'Daily notifications enqueued' });
  } catch (error) {
    if (error instanceof Error) {
      requestLogger.error(
        { err: error, event: 'push.daily_enqueue_failed', userCount: users.length },
        'Failed to enqueue daily notifications',
      );
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

// @desc    Sends hourly push reminder by calculating avg stats (outside cron)
// @route   GET /api/push/hourlyreminder
// @access  Public
export const sendHourlyReminderPush = async (req: Request, res: Response): Promise<void> => {
  const users = await queryGetAllUsersToSendHourlyReminder();
  const requestLogger = req.logger || logger;

  try {
    const pushNotifications: NotificationPayload[] = [];
    const now = new Date();

    for (const user of users) {
      const delayMs = computeDelayFromUTC(now, user.estimated_time_utc, user.reminder_offset_minutes);

      // if time for today already passed -> skip
      if (delayMs === null) {
        continue;
      }

      pushNotifications.push({
        token: user.push_token!,
        title: 'Workout Reminder',
        body: `${user.name!.split(' ')[0]}, get ready! Your ${
          user.split_name
        } workout kicks off in ${user.reminder_offset_minutes} minutes.`,
        delay: delayMs,
        expiresAt: 0,
        ...(req.requestId ? { requestId: req.requestId } : {}),
      });
    }

    if (pushNotifications.length > 0) {
      await enqueuePushNotifications(pushNotifications);
    }

    res.json({
      success: true,
      message: `Enqueued ${pushNotifications.length} workout reminders`,
    });
  } catch (error) {
    if (error instanceof Error) {
      requestLogger.error(
        { err: error, event: 'push.hourly_enqueue_failed', userCount: users.length },
        'Failed to enqueue hourly reminders',
      );
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
