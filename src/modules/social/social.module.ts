import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { CrewsController } from './crews/crews.controller';
import { CrewsQueries } from './crews/crews.queries';
import { CrewsService } from './crews/crews.service';
import { PostsController } from './posts/posts.controller';
import { PostsQueries } from './posts/posts.queries';
import { PostsService } from './posts/posts.service';
import { CommentsController } from './posts/comments/comments.controller';
import { CommentsQueries } from './posts/comments/comments.queries';
import { CommentsService } from './posts/comments/comments.service';
import { ReactionsController } from './posts/reactions/reactions.controller';
import { ReactionsQueries } from './posts/reactions/reactions.queries';
import { ReactionsService } from './posts/reactions/reactions.service';

@Module({
  controllers: [CrewsController, PostsController, ReactionsController, CommentsController],
  providers: [
    CrewsQueries,
    CrewsService,
    PostsQueries,
    PostsService,
    CommentsQueries,
    CommentsService,
    ReactionsQueries,
    ReactionsService,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    RlsTxInterceptor,
  ],
  exports: [CrewsService, PostsService, ReactionsService, CommentsService],
})
export class SocialModule {}
