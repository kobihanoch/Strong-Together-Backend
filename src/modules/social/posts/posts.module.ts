import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { PostsRepository } from './application/ports/posts.repository';
import { CreatePostHandler } from './application/commands/create-post/create-post.handler';
import { DeletePostHandler } from './application/commands/delete-post/delete-post.handler';
import { ListCrewPostsHandler } from './application/queries/list-crew-posts/list-crew-posts.handler';
import { ListVisiblePostsHandler } from './application/queries/list-visible-posts/list-visible-posts.handler';
import { UpdatePostHandler } from './application/commands/update-post/update-post.handler';
import { PostgresPostsRepository } from './infrastructure/persistence/postgres-posts.repository';
import { ListForCrewSql } from './infrastructure/persistence/reads/list-for-crew.sql';
import { ListVisibleSql } from './infrastructure/persistence/reads/list-visible.sql';
import { CreateSql } from './infrastructure/persistence/writes/create.sql';
import { DeleteSql } from './infrastructure/persistence/writes/delete.sql';
import { SaveSql } from './infrastructure/persistence/writes/save.sql';
import { PostsController } from './presentation/posts.controller';
import { PostsQueries } from './application/ports/posts.queries';
import { PostgresPostsQueries } from './infrastructure/persistence/postgres-posts.queries';
import { FindPostByIdForUpdateSql } from './infrastructure/persistence/reads/find-by-id-for-update.sql';

@Module({
  controllers: [PostsController],
  providers: [
    { provide: PostsQueries, useClass: PostgresPostsQueries },
    ListVisiblePostsHandler,
    ListCrewPostsHandler,
    CreatePostHandler,
    UpdatePostHandler,
    DeletePostHandler,
    ListForCrewSql,
    ListVisibleSql,
    CreateSql,
    DeleteSql,
    SaveSql,
    FindPostByIdForUpdateSql,
    { provide: PostsRepository, useClass: PostgresPostsRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class PostsModule {}
