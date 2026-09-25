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
import { AddSql } from './infrastructure/persistence/writes/add.sql';
import { DeleteSql } from './infrastructure/persistence/writes/delete.sql';
import { EditSql } from './infrastructure/persistence/writes/edit.sql';
import { PostgresCommentsRepository } from './infrastructure/persistence/postgres-comments.repository';
import { CommentsController } from './presentation/comments.controller';
import { CommentsQueries } from './application/ports/comments.queries';
import { PostgresCommentsQueries } from './infrastructure/persistence/postgres-comments.queries';

@Module({
  controllers: [CommentsController],
  providers: [
    { provide: CommentsQueries, useClass: PostgresCommentsQueries },
    ListPostCommentsUseCase,
    AddCommentUseCase,
    EditCommentUseCase,
    DeleteCommentUseCase,
    ListForPostSql,
    AddSql,
    DeleteSql,
    EditSql,
    { provide: CommentsRepository, useClass: PostgresCommentsRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class CommentsModule {}
