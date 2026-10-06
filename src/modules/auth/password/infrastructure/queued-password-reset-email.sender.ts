import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { generateJti } from '../../../../common/authentication/authentication.utils';
import { authConfig } from '../../../../config/auth.config';
import { EmailsProducerService } from '../../../../infrastructure/capabilities/queues/emails/emails-producer';
import type { AuthEmailContext } from '../../core/application/models/auth.models';
import { PasswordResetEmailSender } from '../application/ports/password-reset-email-sender.port';
import { generateForgotPasswordEmail } from './password-reset-email.templates';

/** Queue-backed password-reset email sender. */
@Injectable()
export class QueuedPasswordResetEmailSender implements PasswordResetEmailSender {
  constructor(private readonly emailsProducer: EmailsProducerService) {}

  async send(email: string, userId: string, fullName: string, context: AuthEmailContext = {}): Promise<void> {
    const jti = generateJti();
    const token = jwt.sign({ sub: userId, typ: 'forgot-pass', jti, iss: 'strong-together' }, authConfig.jwtForgotPasswordSecret, {
      expiresIn: '5m',
    });
    const changePasswordUrl = `https://strongtogether.kobihanoch.com/reset-password?token=${encodeURIComponent(token)}`;
    const html = generateForgotPasswordEmail({
      fullName,
      changePasswordUrl,
      logoUrl: 'https://strongtogether.kobihanoch.com/appicon.png',
    });
    await this.emailsProducer.enqueueEmails([
      {
        to: email,
        subject: 'Reset your password',
        html,
        ...(context.requestId ? { requestId: context.requestId } : {}),
      },
    ]);
  }
}
