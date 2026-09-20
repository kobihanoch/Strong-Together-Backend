import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { generateJti } from '../../../../common/authentication/authentication.utils';
import { appConfig } from '../../../../config/app.config';
import { authConfig } from '../../../../config/auth.config';
import { EmailsProducerService } from '../../../../infrastructure/queues/emails/emails-producer';
import { UpdateEmailSender } from '../application/ports/update-email-sender.port';
import { generateConfirmEmailChange } from './update-email.templates';

/** Queue-backed email-change confirmation sender. */
@Injectable()
export class QueuedUpdateEmailSender implements UpdateEmailSender {
  constructor(private readonly emailsProducer: EmailsProducerService) {}
  async send(email: string, userId: string, fullName: string, requestId?: string): Promise<void> {
    const normalized = email.trim().toLowerCase();
    const token = jwt.sign(
      { sub: userId, typ: 'email-confirm', newEmail: normalized, jti: generateJti(), iss: 'strong-together' },
      authConfig.changeEmailSecret,
      { expiresIn: '10m' },
    );
    const confirmUrl = `${appConfig.emailApiBaseUrl}/api/users/email-change?token=${encodeURIComponent(token)}`;
    await this.emailsProducer.enqueueEmails([
      {
        to: normalized,
        subject: 'Confirm your Strong Together Email',
        html: generateConfirmEmailChange({ fullName, confirmUrl, logoUrl: 'https://strongtogether.kobihanoch.com/appicon.png' }),
        ...(requestId ? { requestId } : {}),
      },
    ]);
  }
}
