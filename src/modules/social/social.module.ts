import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../infrastructure/supabase/supabase.module';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { CrewsController } from './crews/crews.controller';
import { CrewsQueries } from './crews/crews.queries';
import { CrewsService } from './crews/crews.service';
import { CrewRequestsController } from './crews/requests/crew-requests.controller';
import { CrewRequestsQueries } from './crews/requests/crew-requests.queries';
import { CrewRequestsService } from './crews/requests/crew-requests.service';
import { PostsController } from './posts/posts.controller';
import { PostsQueries } from './posts/posts.queries';
import { PostsService } from './posts/posts.service';
import { CommentsController } from './posts/comments/comments.controller';
import { CommentsQueries } from './posts/comments/comments.queries';
import { CommentsService } from './posts/comments/comments.service';
import { ReactionsController } from './posts/reactions/reactions.controller';
import { ReactionsQueries } from './posts/reactions/reactions.queries';
import { ReactionsService } from './posts/reactions/reactions.service';
import { SocialUsersController } from './users/social-users.controller';
import { SocialUsersQueries } from './users/social-users.queries';
import { SocialUsersService } from './users/social-users.service';

@Module({
  imports: [SupabaseModule],
  controllers: [CrewRequestsController, CrewsController, PostsController, ReactionsController, CommentsController, SocialUsersController],
  providers: [
    CrewsQueries,
    CrewsService,
    CrewRequestsQueries,
    CrewRequestsService,
    PostsQueries,
    PostsService,
    CommentsQueries,
    CommentsService,
    ReactionsQueries,
    ReactionsService,
    SocialUsersQueries,
    SocialUsersService,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    RlsTxInterceptor,
  ],
  exports: [CrewsService, PostsService, ReactionsService, CommentsService],
})
export class SocialModule {}
