import { Module } from '@nestjs/common';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { RateLimitGuard } from '../../../common/guards/rate-limit.guard';
import { AuthCoreModule } from '../core/auth-core.module';
import { AuthenticationEvents } from './application/ports/authentication-events.port';
import { SessionRepository } from './application/ports/session.repository';
import { LoginUseCase } from './application/commands/login.use-case';
import { LogoutUseCase } from './application/commands/logout.use-case';
import { RefreshSessionUseCase } from './application/commands/refresh-session.use-case';
import { NestAuthenticationEvents } from './infrastructure/nest-authentication-events';
import { PostgresSessionRepository } from './infrastructure/persistence/postgres-session.repository';
import { ClearPushTokenSql } from './infrastructure/persistence/writes/clear-push-token.sql';
import { FindLastLoginSql } from './infrastructure/persistence/reads/find-last-login.sql';
import { FindLoginUserSql } from './infrastructure/persistence/reads/find-login-user.sql';
import { FindTokenVersionSql } from './infrastructure/persistence/reads/find-token-version.sql';
import { LogoutSql } from './infrastructure/persistence/writes/logout.sql';
import { RotateIfVersionSql } from './infrastructure/persistence/writes/rotate-if-version.sql';
import { RotateSql } from './infrastructure/persistence/writes/rotate.sql';
import { SessionController } from './presentation/session.controller';

@Module({
  imports: [AuthCoreModule],
  controllers: [SessionController],
  providers: [
    ClearPushTokenSql,
    FindLastLoginSql,
    FindLoginUserSql,
    FindTokenVersionSql,
    LogoutSql,
    RotateIfVersionSql,
    RotateSql,
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
