import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { generateJti } from '../../../../common/authentication/authentication.utils.ts';
import { appConfig } from '../../../../config/app.config.ts';
import { authConfig } from '../../../../config/auth.config.ts';
import { generateConfirmEmailChange } from './update-emails.templates.ts';
import { EmailsProducerService } from '../../../../infrastructure/queues/emails/emails-producer.ts';

type EmailContext = {
  requestId?: string;
};

@Injectable()
export class UpdateEmailsService {
  private readonly base = appConfig.publicBaseUrl;

  constructor(private readonly emailsProducerService: EmailsProducerService) {}

  async sendVerificationEmailForEmailUpdate(
    newEmail: string,
    userId: string,
    fullName: string,
    context: EmailContext = {},
  ) {
    const normalized = newEmail.trim().toLowerCase();
    const jti = generateJti();

    const token = jwt.sign(
      {
        sub: userId,
        typ: 'email-confirm',
        newEmail: normalized,
        jti,
        iss: 'strong-together',
      },
      authConfig.changeEmailSecret,
      { expiresIn: '10m' },
    );

    const confirmUrl = `${this.base}/api/users/changeemail?token=${encodeURIComponent(token)}`;

    const html = generateConfirmEmailChange({
      fullName,
      confirmUrl,
      logoUrl: 'https://strongtogether.kobihanoch.com/appicon.png',
    });

    await this.emailsProducerService.enqueueEmails([
      {
        to: normalized,
        subject: 'Confirm your Strong Together Email',
        html,
        ...(context.requestId ? { requestId: context.requestId } : {}),
      },
    ]);
    /*await sendMail({
    to: normalized,
    subject: "Confirm your Strong Together Email",
    html,
  });*/
  }
}
