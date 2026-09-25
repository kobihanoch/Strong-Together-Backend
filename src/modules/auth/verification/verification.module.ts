import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { EmailsModule } from '../../../infrastructure/queues/emails/emails.module';
import { AuthCoreModule } from '../core/auth-core.module';
import { VerificationEmailSender } from './application/ports/verification-email-sender.port';
import { VerificationRepository } from './application/ports/verification.repository';
import { CreateVerificationEmailUseCase } from './application/commands/create-verification-email.use-case';
import { GetVerificationStatusUseCase } from './application/queries/get-verification-status.use-case';
import { UpdateUnverifiedEmailUseCase } from './application/commands/update-unverified-email.use-case';
import { VerifyEmailUseCase } from './application/commands/verify-email.use-case';
import { PostgresVerificationRepository } from './infrastructure/persistence/postgres-verification.repository';
import { QueuedVerificationEmailSender } from './infrastructure/queued-verification-email.sender';
import { GetVerificationStatusSql } from './infrastructure/persistence/reads/get-verification-status.sql';
import { EmailExistsSql } from './infrastructure/persistence/writes/email-exists.sql';
import { FindByEmailSql } from './infrastructure/persistence/writes/find-by-email.sql';
import { FindByUsernameSql } from './infrastructure/persistence/writes/find-by-username.sql';
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
    VerifyEmailUseCase,
    CreateVerificationEmailUseCase,
    UpdateUnverifiedEmailUseCase,
    GetVerificationStatusUseCase,
    UserRegisteredListener,
    RateLimitGuard,
  ],
})
export class VerificationModule {}
