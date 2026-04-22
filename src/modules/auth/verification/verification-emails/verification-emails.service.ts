import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { generateJti } from '../../../../common/authentication/authentication.utils';
import { appConfig } from '../../../../config/app.config';
import { authConfig } from '../../../../config/auth.config';
import { generateValidateUserEmail } from './verification-emails.templates';
import { EmailsProducerService } from '../../../../infrastructure/queues/emails/emails-producer';

type EmailContext = {
  requestId?: string;
};

@Injectable()
export class VerificationEmailsService {
  constructor(private readonly emailsProducerService: EmailsProducerService) {}

  async sendVerificationEmail(
    email: string,
    userId: string,
    fullName: string,
    context: EmailContext = {},
  ): Promise<void> {
    const jti = generateJti();
    const token = jwt.sign(
      { sub: userId, typ: 'email-verify', jti, iss: 'strong-together' }, // payload
      authConfig.jwtVerifySecret, // strong secret in env
      { expiresIn: '1h' }, // claims
    );
    const verifyUrl = `${appConfig.emailApiBaseUrl}/api/auth/verify?token=${encodeURIComponent(token)}`;
    const html = generateValidateUserEmail({
      fullName,
      verifyUrl,
      logoUrl: `https://strongtogether.kobihanoch.com/appicon.png`,
    });
    await this.emailsProducerService.enqueueEmails([
      {
        to: email,
        subject: 'Confirm your Strong Together account',
        html,
        ...(context.requestId ? { requestId: context.requestId } : {}),
      },
    ]);
    /*await sendMail({
    to: email,
    subject: "Confirm your Strong Together account",
    html,
  });*/
  }
}
