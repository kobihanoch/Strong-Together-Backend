import { Module } from '@nestjs/common';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { EmailsModule } from '../../../infrastructure/queues/emails/emails.module';
import { AuthCoreModule } from '../core/auth-core.module';
import { VerificationEmailSender } from './application/ports/verification-email-sender.port';
import { VerificationRepository } from './application/ports/verification.repository';
import { CreateVerificationEmailUseCase } from './application/use-cases/create-verification-email.use-case';
import { GetVerificationStatusUseCase } from './application/use-cases/get-verification-status.use-case';
import { UpdateUnverifiedEmailUseCase } from './application/use-cases/update-unverified-email.use-case';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import { PostgresVerificationRepository } from './infrastructure/postgres-verification.repository';
import { QueuedVerificationEmailSender } from './infrastructure/queued-verification-email.sender';
import { VerificationSql } from './infrastructure/verification.sql';
import { VerificationController } from './presentation/verification.controller';

@Module({
  imports: [AuthCoreModule, EmailsModule],
  controllers: [VerificationController],
  providers: [
    VerificationSql,
    { provide: VerificationRepository, useClass: PostgresVerificationRepository },
    { provide: VerificationEmailSender, useClass: QueuedVerificationEmailSender },
    VerifyEmailUseCase,
    CreateVerificationEmailUseCase,
    UpdateUnverifiedEmailUseCase,
    GetVerificationStatusUseCase,
    RateLimitGuard,
  ],
  exports: [VerificationEmailSender],
})
export class VerificationModule {}
