import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module.ts';
import { SessionController } from './session/session.controller.ts';
import { VerificationController } from './verification/verification.controller.ts';
import { PasswordController } from './password/password.controller.ts';
import { SessionService } from './session/session.service.ts';
import { VerificationService } from './verification/verification.service.ts';
import { PasswordService } from './password/password.service.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { MessagesModule } from '../messages/messages.module.ts';
import { CreateUserQueries } from '../user/create/create.queries.ts';
import { PasswordQueries } from './password/password.queries.ts';
import { SessionQueries } from './session/session.queries.ts';
import { VerificationQueries } from './verification/verification.queries.ts';

@Module({
  imports: [AuthGuardsModule, MessagesModule],
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
  ],
})
export class AuthModule {}
