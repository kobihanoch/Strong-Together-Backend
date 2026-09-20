import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { generateJti } from '../../../../common/authentication/authentication.utils';
import { appConfig } from '../../../../config/app.config';
import { authConfig } from '../../../../config/auth.config';
import { EmailsProducerService } from '../../../../infrastructure/queues/emails/emails-producer';
import type { AuthEmailContext } from '../../core/application/models/auth.models';
import { VerificationEmailSender } from '../application/ports/verification-email-sender.port';
import { generateValidateUserEmail } from './verification-email.templates';

/** Queue-backed account-verification email sender. */
@Injectable()
export class QueuedVerificationEmailSender implements VerificationEmailSender {
  constructor(private readonly emailsProducer: EmailsProducerService) {}

  async send(email: string, userId: string, fullName: string, context: AuthEmailContext = {}): Promise<void> {
    const jti = generateJti();
    const token = jwt.sign({ sub: userId, typ: 'email-verify', jti, iss: 'strong-together' }, authConfig.jwtVerifySecret, {
      expiresIn: '1h',
    });
    const verifyUrl = `${appConfig.emailApiBaseUrl}/api/auth/email-verification?token=${encodeURIComponent(token)}`;
    const html = generateValidateUserEmail({
      fullName,
      verifyUrl,
      logoUrl: 'https://strongtogether.kobihanoch.com/appicon.png',
    });
    await this.emailsProducer.enqueueEmails([
      {
        to: email,
        subject: 'Confirm your Strong Together account',
        html,
        ...(context.requestId ? { requestId: context.requestId } : {}),
      },
    ]);
  }
}
