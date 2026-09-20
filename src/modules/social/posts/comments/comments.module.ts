import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { CommentsRepository } from './application/ports/comments.repository';
import { AddCommentUseCase } from './application/use-cases/add-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.use-case';
import { EditCommentUseCase } from './application/use-cases/edit-comment.use-case';
import { ListPostCommentsUseCase } from './application/use-cases/list-post-comments.use-case';
import { CommentsSql } from './infrastructure/comments.sql';
import { PostgresCommentsRepository } from './infrastructure/postgres-comments.repository';
import { CommentsController } from './presentation/comments.controller';

@Module({
  controllers: [CommentsController],
  providers: [
    ListPostCommentsUseCase,
    AddCommentUseCase,
    EditCommentUseCase,
    DeleteCommentUseCase,
    CommentsSql,
    { provide: CommentsRepository, useClass: PostgresCommentsRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class CommentsModule {}
