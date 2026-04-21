import { Inject, Injectable } from '@nestjs/common';
import net from 'node:net';
import { Resend } from 'resend';
import { appConfig } from '../../config/app.config';
import { emailConfig } from '../../config/email.config';
import { createLogger } from '../logger';
import { RESEND_CLIENT } from './mailer.tokens';

@Injectable()
export class MailerService {
  private readonly logger = createLogger('config:mailer');
  constructor(@Inject(RESEND_CLIENT) private readonly resend: Resend | null) {}

  async sendMail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<{
    ok: boolean;
    id?: any;
    permanent?: boolean;
    reason?: string;
  }> {
    // Basic input guard
    if (!to || !subject || !html) {
      return { ok: false, permanent: true, reason: 'Missing required fields' };
    }

    if (appConfig.isTest) {
      await this.sendMaildevMail({ to, subject, html });
      return { ok: true, id: `maildev-${Date.now()}` };
    }

    try {
      if (!this.resend) {
        return { ok: false, permanent: true, reason: 'Mailer provider is not configured' };
      }

      const result = await this.resend.emails.send({
        from: 'Strong Together <support@auth.kobihanoch.com>',
        to,
        subject,
        html,
        replyTo: 'support@auth.kobihanoch.com',
      });

      // The Resend SDK returns { data, error } (not always throws)
      if (result?.error) {
        const err = result.error;
        const status = this.getResendStatus(err);
        const msg = err?.message || 'Resend error';

        if (this.isTransientStatus(status) || this.looksTransientMessage(msg)) {
          // Transient: throw → Bull will retry
          throw new Error(`Resend transient error (${status ?? 'n/a'}): ${msg}`);
        }

        // Permanent: don't throw → job won't retry
        this.logger.warn(
          { event: 'mail.permanent_error', provider: 'resend', to, status, reason: msg },
          'Permanent email delivery error',
        );
        return { ok: false, permanent: true, reason: msg };
      }

      // Success path
      return { ok: true, id: result?.data?.id || null };
    } catch (e: unknown) {
      // Network/unknown errors here: treat as transient (retry)
      const status = this.getThrownStatus(e);
      const msg = e instanceof Error ? e.message : 'Resend request failed';
      if (this.isTransientStatus(status) || this.looksTransientMessage(msg) || status === null) {
        throw new Error(`Resend transient failure (${status ?? 'n/a'}): ${msg}`);
      }
      // If we can clearly classify as permanent (rare in catch), return non-throw
      this.logger.warn(
        { event: 'mail.non_throw_permanent_error', provider: 'resend', to, status, reason: msg },
        'Non-retryable email delivery error',
      );
      return { ok: false, permanent: true, reason: msg };
    }
  }

  // ---- Helpers ----
  private getResendStatus(err: { name: string } | null | undefined): number | null {
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

  private getThrownStatus(err: unknown): number | null {
    if (!err || typeof err !== 'object') return null;

    const maybeErr = err as {
      statusCode?: unknown;
      response?: { status?: unknown };
    };

    if (typeof maybeErr.statusCode === 'number') return maybeErr.statusCode;
    if (typeof maybeErr.response?.status === 'number') return maybeErr.response.status;
    return null;
  }

  private isTransientStatus(status: number | null): boolean {
    if (status == null) return true; // no status (network/timeout) → transient
    if (status >= 500) return true; // server errors → transient
    if (status === 429) return true; // rate limit → transient
    return false; // 4xx (except 429) → permanent
  }

  private looksTransientMessage(msg: string = ''): boolean {
    const m = msg.toLowerCase();
    return (
      m.includes('timeout') ||
      m.includes('temporarily') ||
      (m.includes('rate') && m.includes('limit')) ||
      m.includes('unavailable')
    );
  }

  private async sendMaildevMail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
    const from = 'support@auth.kobihanoch.com';
    const data = [
      `From: Strong Together <${from}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      html.replace(/^\./gm, '..'),
      '.',
      '',
    ].join('\r\n');

    await new Promise<void>((resolve, reject) => {
      const socket = net.createConnection(emailConfig.maildevSmtpPort, emailConfig.maildevSmtpHost);
      const commands = [`HELO localhost`, `MAIL FROM:<${from}>`, `RCPT TO:<${to}>`, 'DATA', data, 'QUIT'];
      let commandIndex = 0;
      let settled = false;

      const fail = (error: Error) => {
        if (settled) return;
        settled = true;
        socket.destroy();
        reject(error);
      };

      socket.setEncoding('utf8');
      socket.setTimeout(5000, () => fail(new Error('Maildev SMTP timeout')));
      socket.on('error', fail);
      socket.on('data', (chunk) => {
        const lines = String(chunk).split(/\r?\n/).filter(Boolean);
        const last = lines[lines.length - 1] ?? '';
        if (/^\d{3}-/.test(last)) return;
        if (!/^[235]\d{2}/.test(last)) {
          fail(new Error(`Maildev SMTP rejected command: ${last}`));
          return;
        }

        const command = commands[commandIndex++];
        if (command) {
          socket.write(`${command}\r\n`);
          return;
        }

        if (!settled) {
          settled = true;
          socket.end();
          resolve();
        }
      });
    });
  }
}
