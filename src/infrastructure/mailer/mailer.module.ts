import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service.ts';
import { RESEND_CLIENT } from './mailer.tokens.ts';
import { emailConfig } from '../../config/email.config.ts';
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
