import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { EmailsModule } from '../../../infrastructure/capabilities/queues/emails/emails.module';
import { AuthCoreModule } from '../core/auth-core.module';
import { SessionModule } from '../session/session.module';
import { PasswordRepository } from './application/ports/password.repository';
import { PasswordResetQueries } from './application/ports/password-reset.queries';
import { PasswordResetEmailSender } from './application/ports/password-reset-email-sender.port';
import { CreatePasswordResetRequestHandler } from './application/commands/create-password-reset-request/create-password-reset-request.handler';
import { ResetPasswordHandler } from './application/commands/reset-password/reset-password.handler';
import { FindResetRecipientSql } from './infrastructure/persistence/reads/find-reset-recipient.sql';
import { SaveSql } from './infrastructure/persistence/writes/save.sql';
import { PostgresPasswordRepository } from './infrastructure/persistence/postgres-password.repository';
import { PostgresPasswordResetQueries } from './infrastructure/persistence/postgres-password-reset.queries';
import { QueuedPasswordResetEmailSender } from './infrastructure/queued-password-reset-email.sender';
import { PasswordController } from './presentation/password.controller';

@Module({
  imports: [AuthCoreModule, SessionModule, EmailsModule],
  controllers: [PasswordController],
  providers: [
    FindResetRecipientSql,
    SaveSql,
    { provide: PasswordResetQueries, useClass: PostgresPasswordResetQueries },
    { provide: PasswordRepository, useClass: PostgresPasswordRepository },
    { provide: PasswordResetEmailSender, useClass: QueuedPasswordResetEmailSender },
    CreatePasswordResetRequestHandler,
    ResetPasswordHandler,
    RateLimitGuard,
  ],
})
export class PasswordModule {}
