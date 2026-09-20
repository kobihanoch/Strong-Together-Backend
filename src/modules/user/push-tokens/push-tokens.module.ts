import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { PushTokensRepository } from './application/ports/push-tokens.repository';
import { ReplacePushTokenUseCase } from './application/use-cases/replace-push-token.use-case';
import { PostgresPushTokensRepository } from './infrastructure/postgres-push-tokens.repository';
import { PushTokensSql } from './infrastructure/push-tokens.sql';
import { PushTokensController } from './presentation/push-tokens.controller';
/** Composes user push-token management and its adapters. */
@Module({
  controllers: [PushTokensController],
  providers: [
    PushTokensSql,
    { provide: PushTokensRepository, useClass: PostgresPushTokensRepository },
    ReplacePushTokenUseCase,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class PushTokensModule {}
