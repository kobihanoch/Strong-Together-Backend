import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { ReactionsRepository } from './application/ports/reactions.repository';
import { DeleteReactionUseCase } from './application/use-cases/delete-reaction.use-case';
import { ListPostReactionsUseCase } from './application/use-cases/list-post-reactions.use-case';
import { ReactToPostUseCase } from './application/use-cases/react-to-post.use-case';
import { PostgresReactionsRepository } from './infrastructure/postgres-reactions.repository';
import { ReactionsSql } from './infrastructure/reactions.sql';
import { ReactionsController } from './presentation/reactions.controller';

@Module({
  controllers: [ReactionsController],
  providers: [
    ListPostReactionsUseCase,
    ReactToPostUseCase,
    DeleteReactionUseCase,
    ReactionsSql,
    { provide: ReactionsRepository, useClass: PostgresReactionsRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class ReactionsModule {}
