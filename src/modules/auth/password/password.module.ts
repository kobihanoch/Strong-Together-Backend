import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { EmailsModule } from '../../../infrastructure/capabilities/queues/emails/emails.module';
import { AuthCoreModule } from '../core/auth-core.module';
import { SessionModule } from '../session/session.module';
import { PasswordRepository } from './application/ports/password.repository';
import { PasswordResetEmailSender } from './application/ports/password-reset-email-sender.port';
import { CreatePasswordResetRequestUseCase } from './application/commands/create-password-reset-request.use-case';
import { ResetPasswordUseCase } from './application/commands/reset-password.use-case';
import { FindResetRecipientSql } from './infrastructure/persistence/reads/find-reset-recipient.sql';
import { UpdatePasswordSql } from './infrastructure/persistence/writes/update-password.sql';
import { PostgresPasswordRepository } from './infrastructure/persistence/postgres-password.repository';
import { QueuedPasswordResetEmailSender } from './infrastructure/queued-password-reset-email.sender';
import { PasswordController } from './presentation/password.controller';

@Module({
  imports: [AuthCoreModule, SessionModule, EmailsModule],
  controllers: [PasswordController],
  providers: [
    FindResetRecipientSql,
    UpdatePasswordSql,
    { provide: PasswordRepository, useClass: PostgresPasswordRepository },
    { provide: PasswordResetEmailSender, useClass: QueuedPasswordResetEmailSender },
    CreatePasswordResetRequestUseCase,
    ResetPasswordUseCase,
    RateLimitGuard,
  ],
})
export class PasswordModule {}
