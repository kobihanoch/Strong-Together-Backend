import { Module } from '@nestjs/common';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { AuthCoreModule } from '../core/auth-core.module';
import { AuthenticationEvents } from './application/ports/authentication-events.port';
import { SessionRepository } from './application/ports/session.repository';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshSessionUseCase } from './application/use-cases/refresh-session.use-case';
import { NestAuthenticationEvents } from './infrastructure/nest-authentication-events';
import { PostgresSessionRepository } from './infrastructure/postgres-session.repository';
import { SessionSql } from './infrastructure/session.sql';
import { SessionController } from './presentation/session.controller';

@Module({
  imports: [AuthCoreModule],
  controllers: [SessionController],
  providers: [
    SessionSql,
    { provide: SessionRepository, useClass: PostgresSessionRepository },
    { provide: AuthenticationEvents, useClass: NestAuthenticationEvents },
    LoginUseCase,
    LogoutUseCase,
    RefreshSessionUseCase,
    DpopGuard,
    RateLimitGuard,
  ],
  exports: [SessionRepository, AuthenticationEvents],
})
export class SessionModule {}
