import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';
import { PushQueries } from './push.queries.ts';
import { enqueuePushNotifications } from '../../infrastructure/queues/push-notifications/push-notifications-producer.ts';
import type { NotificationPayload } from './push.dtos.ts';
import { computeDelayFromUTC } from './push.utils.ts';

export type PushBatchResponse = {
  success: true;
  message: string;
  userCount: number;
};

// Returns { ok: true, id? } OR { ok: false, permanent: true, reason }
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
  constructor(private readonly pushQueries: PushQueries) {}

  async sendPushNotification(token: string, title: string, body: string) {
    return sendPushNotification(token, title, body);
  }

  async sendDailyPushData(requestId?: string): Promise<PushBatchResponse> {
    const users = await this.pushQueries.queryGetAllUsersWithNotificationsEnabled();

    await enqueuePushNotifications(
      users.map((user) => ({
        token: user.push_token!,
        title: `Hello, ${user.name!.split(' ')[0]}!`,
        body: 'Ready to go workout?',
        delay: 0,
        expiresAt: 0,
        ...(requestId ? { requestId } : {}),
      })),
    );

    return { success: true, message: 'Daily notifications enqueued', userCount: users.length };
  }

  async sendHourlyReminderPushData(requestId?: string): Promise<PushBatchResponse> {
    const users = await this.pushQueries.queryGetAllUsersToSendHourlyReminder();
    const pushNotifications: NotificationPayload[] = [];
    const now = new Date();

    for (const user of users) {
      const delayMs = computeDelayFromUTC(now, user.estimated_time_utc, user.reminder_offset_minutes);

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
        ...(requestId ? { requestId } : {}),
      });
    }

    if (pushNotifications.length > 0) {
      await enqueuePushNotifications(pushNotifications);
    }

    return {
      success: true,
      message: `Enqueued ${pushNotifications.length} workout reminders`,
      userCount: users.length,
    };
  }
}
