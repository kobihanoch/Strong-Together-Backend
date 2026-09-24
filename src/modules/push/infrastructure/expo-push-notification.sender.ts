import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { PushNotificationInput, SendPushNotificationOutcome } from '../application/models/push.models';
import { PushNotificationSender } from '../application/ports/push-notification-sender.port';

/** Sends individual notifications through the Expo push API. */
@Injectable()
export class ExpoPushNotificationSender implements PushNotificationSender {
  public async send(input: PushNotificationInput): Promise<SendPushNotificationOutcome> {
    if (!input.token || typeof input.token !== 'string' || input.token.length < 10) {
      return { kind: 'permanent-failure', reason: 'Invalid token' };
    }

    try {
      const response = await axios.post(
        'https://exp.host/--/api/v2/push/send',
        { to: input.token, sound: 'default', title: input.title, body: input.body },
        {
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          timeout: 8000,
          validateStatus: () => true,
        },
      );

      if (response.status >= 500 || response.status === 429) {
        return { kind: 'temporarily-unavailable', reason: `Expo HTTP transient ${response.status}` };
      }
      if (response.status >= 400) {
        return { kind: 'permanent-failure', reason: `Expo HTTP ${response.status}` };
      }

      const ticket = response?.data?.data ?? response?.data;
      const status = ticket?.status;
      if (status === 'ok') return { kind: 'sent', ticketId: ticket?.id || null };

      const code = ticket?.details?.error || ticket?.error || 'unknown';
      const reason = ticket?.message || code;
      if (isExpoTransientCode(code)) {
        return { kind: 'temporarily-unavailable', reason: `Expo transient: ${code} - ${reason}` };
      }

      return { kind: 'permanent-failure', reason: `${code}: ${reason}` };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return { kind: 'temporarily-unavailable', reason: error.message };
      }
      throw error;
    }
  }
}

function isExpoTransientCode(code = ''): boolean {
  const normalizedCode = String(code).toLowerCase();
  return (
    normalizedCode.includes('rate') ||
    normalizedCode.includes('unavailable') ||
    normalizedCode.includes('timeout') ||
    normalizedCode.includes('internal') ||
    normalizedCode.includes('server')
  );
}
