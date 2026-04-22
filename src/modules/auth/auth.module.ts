import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { SessionController } from './session/session.controller';
import { VerificationController } from './verification/verification.controller';
import { PasswordController } from './password/password.controller';
import { SessionService } from './session/session.service';
import { VerificationService } from './verification/verification.service';
import { PasswordService } from './password/password.service';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { MessagesModule } from '../messages/messages.module';
import { CreateUserQueries } from '../user/create/create.queries';
import { PasswordQueries } from './password/password.queries';
import { SessionQueries } from './session/session.queries';
import { VerificationQueries } from './verification/verification.queries';
import { VerificationEmailsService } from './verification/verification-emails/verification-emails.service';
import { PasswordEmailsService } from './password/password-emails/password-emails.service';
import { EmailsModule } from '../../infrastructure/queues/emails/emails.module';

@Module({
  imports: [AuthGuardsModule, MessagesModule, EmailsModule],
  controllers: [SessionController, VerificationController, PasswordController],
  providers: [
    SessionQueries,
    SessionService,
    VerificationQueries,
    VerificationService,
    PasswordQueries,
    PasswordService,
    CreateUserQueries,
    DpopGuard,
    RateLimitGuard,
    RlsTxInterceptor,
    VerificationEmailsService,
    PasswordEmailsService,
  ],
  exports: [VerificationEmailsService],
})
export class AuthModule {}
