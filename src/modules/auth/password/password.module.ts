import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { EmailsModule } from '../../../infrastructure/queues/emails/emails.module';
import { AuthCoreModule } from '../core/auth-core.module';
import { SessionModule } from '../session/session.module';
import { PasswordRepository } from './application/ports/password.repository';
import { PasswordResetEmailSender } from './application/ports/password-reset-email-sender.port';
import { CreatePasswordResetRequestUseCase } from './application/use-cases/create-password-reset-request.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { PasswordSql } from './infrastructure/password.sql';
import { PostgresPasswordRepository } from './infrastructure/postgres-password.repository';
import { QueuedPasswordResetEmailSender } from './infrastructure/queued-password-reset-email.sender';
import { PasswordController } from './presentation/password.controller';

@Module({
  imports: [AuthCoreModule, SessionModule, EmailsModule],
  controllers: [PasswordController],
  providers: [
    PasswordSql,
    { provide: PasswordRepository, useClass: PostgresPasswordRepository },
    { provide: PasswordResetEmailSender, useClass: QueuedPasswordResetEmailSender },
    CreatePasswordResetRequestUseCase,
    ResetPasswordUseCase,
    RateLimitGuard,
  ],
})
export class PasswordModule {}
