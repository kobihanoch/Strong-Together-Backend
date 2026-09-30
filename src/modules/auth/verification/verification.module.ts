import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { EmailsModule } from '../../../infrastructure/capabilities/queues/emails/emails.module';
import { AuthCoreModule } from '../core/auth-core.module';
import { VerificationEmailSender } from './application/ports/verification-email-sender.port';
import { VerificationRepository } from './application/ports/verification.repository';
import { CreateVerificationEmailHandler } from './application/commands/create-verification-email/create-verification-email.handler';
import { GetVerificationStatusHandler } from './application/queries/get-verification-status/get-verification-status.handler';
import { UpdateUnverifiedEmailHandler } from './application/commands/update-unverified-email/update-unverified-email.handler';
import { VerifyEmailHandler } from './application/commands/verify-email/verify-email.handler';
import { PostgresVerificationRepository } from './infrastructure/persistence/postgres-verification.repository';
import { QueuedVerificationEmailSender } from './infrastructure/queued-verification-email.sender';
import { GetVerificationStatusSql } from './infrastructure/persistence/reads/get-verification-status.sql';
import { EmailExistsSql } from './infrastructure/persistence/reads/email-exists.sql';
import { FindByEmailSql } from './infrastructure/persistence/reads/find-by-email.sql';
import { FindByUsernameSql } from './infrastructure/persistence/reads/find-by-username.sql';
import { UpdateEmailSql } from './infrastructure/persistence/writes/update-email.sql';
import { UpdateVerificationSql } from './infrastructure/persistence/writes/update-verification.sql';
import { VerificationController } from './presentation/verification.controller';
import { UserRegisteredListener } from './user-registered.listener';
import { VerificationQueries } from './application/ports/verification.queries';
import { PostgresVerificationQueries } from './infrastructure/persistence/postgres-verification.queries';

@Module({
  imports: [AuthCoreModule, EmailsModule],
  controllers: [VerificationController],
  providers: [
    { provide: VerificationQueries, useClass: PostgresVerificationQueries },
    GetVerificationStatusSql,
    EmailExistsSql,
    FindByEmailSql,
    FindByUsernameSql,
    UpdateEmailSql,
    UpdateVerificationSql,
    { provide: VerificationRepository, useClass: PostgresVerificationRepository },
    { provide: VerificationEmailSender, useClass: QueuedVerificationEmailSender },
    VerifyEmailHandler,
    CreateVerificationEmailHandler,
    UpdateUnverifiedEmailHandler,
    GetVerificationStatusHandler,
    UserRegisteredListener,
    RateLimitGuard,
  ],
})
export class VerificationModule {}
