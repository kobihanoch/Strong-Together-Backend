import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { CommentsRepository } from './application/ports/comments.repository';
import { AddCommentHandler } from './application/commands/add-comment/add-comment.handler';
import { DeleteCommentHandler } from './application/commands/delete-comment/delete-comment.handler';
import { EditCommentHandler } from './application/commands/edit-comment/edit-comment.handler';
import { ListPostCommentsHandler } from './application/queries/list-post-comments/list-post-comments.handler';
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
    ListPostCommentsHandler,
    AddCommentHandler,
    EditCommentHandler,
    DeleteCommentHandler,
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
