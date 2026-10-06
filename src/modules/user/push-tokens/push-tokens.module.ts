import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { PushTokensRepository } from './application/ports/push-tokens.repository';
import { ReplacePushTokenHandler } from './application/commands/replace-push-token/replace-push-token.handler';
import { PostgresPushTokensRepository } from './infrastructure/persistence/postgres-push-tokens.repository';
import { ReplaceSql } from './infrastructure/persistence/writes/replace.sql';
import { PushTokensController } from './presentation/push-tokens.controller';
/** Composes user push-token management and its adapters. */
@Module({
  controllers: [PushTokensController],
  providers: [
    ReplaceSql,
    { provide: PushTokensRepository, useClass: PostgresPushTokensRepository },
    ReplacePushTokenHandler,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class PushTokensModule {}
