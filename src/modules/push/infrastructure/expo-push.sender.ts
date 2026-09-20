import { ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';

/** Sends one notification directly through the Expo push API. */
export async function sendPushNotification(token: string, title: string, body: string) {
  if (!token || typeof token !== 'string' || token.length < 10) {
    return { ok: false, permanent: true, reason: 'Invalid token' };
  }

  const response = await axios.post(
    'https://exp.host/--/api/v2/push/send',
    { to: token, sound: 'default', title, body },
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
    throw new ServiceUnavailableException(`Expo HTTP transient ${response.status}`);
  }
  if (response.status >= 400) {
    return { ok: false, permanent: true, reason: `Expo HTTP ${response.status}` };
  }

  const ticket = response?.data?.data ?? response?.data;
  const status = ticket?.status;
  if (status === 'ok') return { ok: true, id: ticket?.id || null };

  const code = ticket?.details?.error || ticket?.error || 'unknown';
  const reason = ticket?.message || code;
  if (isExpoTransientCode(code)) {
    throw new ServiceUnavailableException(`Expo transient: ${code} - ${reason}`);
  }

  return { ok: false, permanent: true, reason: `${code}: ${reason}` };
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
