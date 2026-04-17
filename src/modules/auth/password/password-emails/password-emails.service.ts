import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { generateJti } from '../../../../common/authentication/authentication.utils.ts';
import { authConfig } from '../../../../config/auth.config.ts';
import { EmailsProducerService } from './../../../../infrastructure/queues/emails/emails-producer.ts';
import { generateForgotPasswordEmail } from './password-emails.templates.ts';

type EmailContext = {
  requestId?: string;
};

@Injectable()
export class PasswordEmailsService {
  constructor(private readonly EmailsProducerService: EmailsProducerService) {}

  async sendForgotPasswordEmail(email: string, userId: string, fullName: string, context: EmailContext = {}) {
    const jti = generateJti();
    const token = jwt.sign(
      { sub: userId, typ: 'forgot-pass', jti, iss: 'strong-together' }, // payload
      authConfig.jwtForgotPasswordSecret, // strong secret in env
      { expiresIn: '5m' }, // claims
    );
    const changePasswordUrl = `https://strongtogether.kobihanoch.com/reset-password?token=${encodeURIComponent(token)}`;
    const html = generateForgotPasswordEmail({
      fullName,
      changePasswordUrl,
      logoUrl: `https://strongtogether.kobihanoch.com/appicon.png`,
    });
    await this.EmailsProducerService.enqueueEmails([
      {
        to: email,
        subject: 'Reset your password',
        html,
        ...(context.requestId ? { requestId: context.requestId } : {}),
      },
    ]);
    //await sendMail({ to: email, subject: "Reset your password", html });
  }
}
