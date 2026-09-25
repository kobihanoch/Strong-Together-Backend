import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { PostsRepository } from './application/ports/posts.repository';
import { CreatePostUseCase } from './application/commands/create-post.use-case';
import { DeletePostUseCase } from './application/commands/delete-post.use-case';
import { ListCrewPostsUseCase } from './application/queries/list-crew-posts.use-case';
import { ListVisiblePostsUseCase } from './application/queries/list-visible-posts.use-case';
import { UpdatePostUseCase } from './application/commands/update-post.use-case';
import { PostgresPostsRepository } from './infrastructure/persistence/postgres-posts.repository';
import { ListForCrewSql } from './infrastructure/persistence/reads/list-for-crew.sql';
import { ListVisibleSql } from './infrastructure/persistence/reads/list-visible.sql';
import { CreateSql } from './infrastructure/persistence/writes/create.sql';
import { DeleteSql } from './infrastructure/persistence/writes/delete.sql';
import { UpdateSql } from './infrastructure/persistence/writes/update.sql';
import { PostsController } from './presentation/posts.controller';
import { PostsQueries } from './application/ports/posts.queries';
import { PostgresPostsQueries } from './infrastructure/persistence/postgres-posts.queries';

@Module({
  controllers: [PostsController],
  providers: [
    { provide: PostsQueries, useClass: PostgresPostsQueries },
    ListVisiblePostsUseCase,
    ListCrewPostsUseCase,
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    ListForCrewSql,
    ListVisibleSql,
    CreateSql,
    DeleteSql,
    UpdateSql,
    { provide: PostsRepository, useClass: PostgresPostsRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class PostsModule {}
