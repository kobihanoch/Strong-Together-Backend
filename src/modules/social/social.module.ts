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

@Module({
  controllers: [CrewsController, PostsController],
  providers: [
    CrewsQueries,
    CrewsService,
    PostsQueries,
    PostsService,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    RlsTxInterceptor,
  ],
  exports: [CrewsService, PostsService],
})
export class SocialModule {}
