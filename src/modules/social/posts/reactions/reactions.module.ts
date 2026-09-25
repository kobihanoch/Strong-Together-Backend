import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { ReactionsRepository } from './application/ports/reactions.repository';
import { DeleteReactionUseCase } from './application/commands/delete-reaction.use-case';
import { ListPostReactionsUseCase } from './application/queries/list-post-reactions.use-case';
import { ReactToPostUseCase } from './application/commands/react-to-post.use-case';
import { PostgresReactionsRepository } from './infrastructure/persistence/postgres-reactions.repository';
import { ListForPostSql } from './infrastructure/persistence/reads/list-for-post.sql';
import { DeleteSql } from './infrastructure/persistence/writes/delete.sql';
import { SaveSql } from './infrastructure/persistence/writes/save.sql';
import { ReactionsController } from './presentation/reactions.controller';
import { ReactionsQueries } from './application/ports/reactions.queries';
import { PostgresReactionsQueries } from './infrastructure/persistence/postgres-reactions.queries';

@Module({
  controllers: [ReactionsController],
  providers: [
    { provide: ReactionsQueries, useClass: PostgresReactionsQueries },
    ListPostReactionsUseCase,
    ReactToPostUseCase,
    DeleteReactionUseCase,
    ListForPostSql,
    DeleteSql,
    SaveSql,
    { provide: ReactionsRepository, useClass: PostgresReactionsRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class ReactionsModule {}
