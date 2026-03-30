import { Resend } from 'resend';
import { createLogger } from './logger.ts';

const resend = new Resend(process.env.RESEND_API_KEY);
const logger = createLogger('config:mailer');

/**
 * Returns:
 *  - { ok: true, id?: string } on success
 *  - { ok: false, permanent: true, reason: string } on permanent error (no throw)
 * Throws:
 *  - Error on transient error (so Bull will retry)
 */
export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<{
  ok: boolean;
  id?: any;
  permanent?: boolean;
  reason?: string;
}> {
  // Basic input guard
  if (!to || !subject || !html) {
    return { ok: false, permanent: true, reason: 'Missing required fields' };
  }

  try {
    const result = await resend.emails.send({
      from: 'Strong Together <support@auth.kobihanoch.com>',
      to,
      subject,
      html,
      replyTo: 'support@auth.kobihanoch.com',
    });

    // The Resend SDK returns { data, error } (not always throws)
    if (result?.error) {
      const err = result.error;
      const status = getResendStatus(err);
      const msg = err?.message || 'Resend error';

      if (isTransientStatus(status) || looksTransientMessage(msg)) {
        // Transient: throw → Bull will retry
        throw new Error(`Resend transient error (${status ?? 'n/a'}): ${msg}`);
      }

      // Permanent: don't throw → job won't retry
      logger.warn(
        { event: 'mail.permanent_error', provider: 'resend', to, status, reason: msg },
        'Permanent email delivery error',
      );
      return { ok: false, permanent: true, reason: msg };
    }

    // Success path
    return { ok: true, id: result?.data?.id || null };
  } catch (e: unknown) {
    // Network/unknown errors here: treat as transient (retry)
    const status = getThrownStatus(e);
    const msg = e instanceof Error ? e.message : 'Resend request failed';
    if (isTransientStatus(status) || looksTransientMessage(msg) || status === null) {
      throw new Error(`Resend transient failure (${status ?? 'n/a'}): ${msg}`);
    }
    // If we can clearly classify as permanent (rare in catch), return non-throw
    logger.warn(
      { event: 'mail.non_throw_permanent_error', provider: 'resend', to, status, reason: msg },
      'Non-retryable email delivery error',
    );
    return { ok: false, permanent: true, reason: msg };
  }
}

// ---- Helpers ----
function getResendStatus(err: { name: string } | null | undefined): number | null {
  if (!err?.name) return null;

  switch (err.name) {
    case 'rate_limit_exceeded':
      return 429;
    case 'missing_api_key':
      return 401;
    case 'invalid_api_key':
    case 'invalid_from_address':
    case 'validation_error':
      return 403;
    case 'not_found':
      return 404;
    case 'method_not_allowed':
      return 405;
    case 'application_error':
    case 'internal_server_error':
      return 500;
    default:
      return 422;
  }
}

function getThrownStatus(err: unknown): number | null {
  if (!err || typeof err !== 'object') return null;

  const maybeErr = err as {
    statusCode?: unknown;
    response?: { status?: unknown };
  };

  if (typeof maybeErr.statusCode === 'number') return maybeErr.statusCode;
  if (typeof maybeErr.response?.status === 'number') return maybeErr.response.status;
  return null;
}

function isTransientStatus(status: number | null): boolean {
  if (status == null) return true; // no status (network/timeout) → transient
  if (status >= 500) return true; // server errors → transient
  if (status === 429) return true; // rate limit → transient
  return false; // 4xx (except 429) → permanent
}

function looksTransientMessage(msg: string = ''): boolean {
  const m = msg.toLowerCase();
  return (
    m.includes('timeout') ||
    m.includes('temporarily') ||
    (m.includes('rate') && m.includes('limit')) ||
    m.includes('unavailable')
  );
}
