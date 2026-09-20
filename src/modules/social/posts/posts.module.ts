import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { PostsRepository } from './application/ports/posts.repository';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { ListCrewPostsUseCase } from './application/use-cases/list-crew-posts.use-case';
import { ListVisiblePostsUseCase } from './application/use-cases/list-visible-posts.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { PostgresPostsRepository } from './infrastructure/postgres-posts.repository';
import { PostsSql } from './infrastructure/posts.sql';
import { PostsController } from './presentation/posts.controller';

@Module({
  controllers: [PostsController],
  providers: [
    ListVisiblePostsUseCase,
    ListCrewPostsUseCase,
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    PostsSql,
    { provide: PostsRepository, useClass: PostgresPostsRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class PostsModule {}
