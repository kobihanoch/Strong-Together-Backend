import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { CommentsRepository } from './application/ports/comments.repository';
import { AddCommentUseCase } from './application/commands/add-comment.use-case';
import { DeleteCommentUseCase } from './application/commands/delete-comment.use-case';
import { EditCommentUseCase } from './application/commands/edit-comment.use-case';
import { ListPostCommentsUseCase } from './application/queries/list-post-comments.use-case';
import { ListForPostSql } from './infrastructure/persistence/reads/list-for-post.sql';
import { CreateSql } from './infrastructure/persistence/writes/create.sql';
import { DeleteSql } from './infrastructure/persistence/writes/delete.sql';
import { SaveSql } from './infrastructure/persistence/writes/save.sql';
import { PostgresCommentsRepository } from './infrastructure/persistence/postgres-comments.repository';
import { CommentsController } from './presentation/comments.controller';
import { CommentsQueries } from './application/ports/comments.queries';
import { PostgresCommentsQueries } from './infrastructure/persistence/postgres-comments.queries';
import { FindCommentByIdForUpdateSql } from './infrastructure/persistence/reads/find-by-id-for-update.sql';

@Module({
  controllers: [CommentsController],
  providers: [
    { provide: CommentsQueries, useClass: PostgresCommentsQueries },
    ListPostCommentsUseCase,
    AddCommentUseCase,
    EditCommentUseCase,
    DeleteCommentUseCase,
    ListForPostSql,
    CreateSql,
    DeleteSql,
    SaveSql,
    FindCommentByIdForUpdateSql,
    { provide: CommentsRepository, useClass: PostgresCommentsRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class CommentsModule {}
