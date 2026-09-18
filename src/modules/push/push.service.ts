import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';
import { PushNotificationsProducerService } from '../../infrastructure/queues/push-notifications/push-notifications-producer';
import { PushQueries } from './push.queries';

export type PushBatchResponse = {
  success: true;
  message: string;
  reminderCount: number;
};

// Returns { ok: true, id? } OR { ok: false, permanent: true, reason }
/**
 * Sends a push notification to an Expo push token.
 * @param token - The token to process.
 * @param title - The notification title.
 * @param body - The validated request body.
 */
export async function sendPushNotification(token: string, title: string, body: string) {
  if (!token || typeof token !== 'string' || token.length < 10)
    return { ok: false, permanent: true, reason: 'Invalid token' };

  const message = { to: token, sound: 'default', title, body };

  const res = await axios.post('https://exp.host/--/api/v2/push/send', message, {
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    timeout: 8000,
    validateStatus: () => true,
  });

  // HTTP transport-level
  if (res.status >= 500 || res.status === 429) {
    throw new ServiceUnavailableException(`Expo HTTP transient ${res.status}`);
  }
  if (res.status >= 400) {
    return { ok: false, permanent: true, reason: `Expo HTTP ${res.status}` };
  }

  // Body-level (ticket)
  const ticket = res?.data?.data ?? res?.data;
  const status = ticket?.status;
  if (status === 'ok') return { ok: true, id: ticket?.id || null };

  const code = ticket?.details?.error || ticket?.error || 'unknown';
  const reason = ticket?.message || code;

  if (isExpoTransientCode(code)) {
    throw new ServiceUnavailableException(`Expo transient: ${code} - ${reason}`);
  }

  if (code === 'DeviceNotRegistered') {
    // Optionally disable token in DB here
    // await markTokenDisabled(token, "DeviceNotRegistered");
  }
  return { ok: false, permanent: true, reason: `${code}: ${reason}` };
}

/**
 * Determines whether an Expo error code represents a transient failure.
 * @param code - The provider error code.
 */
function isExpoTransientCode(code = '') {
  const c = String(code).toLowerCase();
  return (
    c.includes('rate') || // MessageRateExceeded / ExpoRateLimitExceeded
    c.includes('unavailable') || // ServiceUnavailable
    c.includes('timeout') ||
    c.includes('internal') ||
    c.includes('server')
  );
}

@Injectable()
export class PushService {
  constructor(
    private readonly pushQueries: PushQueries,
    private readonly pushNotificationsProducerService: PushNotificationsProducerService,
  ) {}

  /**
   * Sends a push notification to an Expo push token.
   * @param token - The token to process.
   * @param title - The notification title.
   * @param body - The validated request body.
   */
  async sendPushNotification(token: string, title: string, body: string) {
    return sendPushNotification(token, title, body);
  }

  /**
   * Enqueues workout reminders due during the hourly cron window.
   * @param requestId - The request correlation identifier.
   * @returns The enqueue result and number of reminders found.
   */
  async enqueueDueWorkoutReminders(requestId?: string): Promise<PushBatchResponse> {
    const reminders = await this.pushQueries.queryDueWorkoutReminders();
    const now = Date.now();

    await this.pushNotificationsProducerService.enqueuePushNotifications(
      reminders.map((reminder) => ({
        userId: reminder.userId,
        workoutScheduleId: reminder.workoutScheduleId,
        occurrenceDate: reminder.occurrenceDate,
        reminderAt: reminder.reminderAt.toISOString(),
        title: `Hello, ${reminder.firstName}!`,
        body: `Your ${reminder.splitName} workout starts soon.`,
        delay: Math.max(0, reminder.reminderAt.getTime() - now),
        expiresAt: 0,
        ...(requestId ? { requestId } : {}),
      })),
    );

    return { success: true, message: 'Workout reminders enqueued', reminderCount: reminders.length };
  }
}
