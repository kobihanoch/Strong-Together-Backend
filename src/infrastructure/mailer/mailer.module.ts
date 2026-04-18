import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { RESEND_CLIENT } from './mailer.tokens';
import { emailConfig } from '../../config/email.config';
import { Resend } from 'resend';

@Module({
  providers: [
    MailerService,
    {
      provide: RESEND_CLIENT,
      useFactory: () => new Resend(emailConfig.resendApiKey),
    },
  ],
  exports: [MailerService],
})
export class MailerModule {}
