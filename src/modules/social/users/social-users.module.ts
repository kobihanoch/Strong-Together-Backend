import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { SocialUsersQueries } from './application/ports/social-users.queries';
import { GetSocialUserUseCase } from './application/queries/get-social-user.use-case';
import { SearchSocialUsersUseCase } from './application/queries/search-social-users.use-case';
import { PostgresSocialUsersQueries } from './infrastructure/persistence/postgres-social-users.queries';
import { FindByIdSql } from './infrastructure/persistence/reads/find-by-id.sql';
import { SearchSql } from './infrastructure/persistence/reads/search.sql';
import { SocialUsersController } from './presentation/social-users.controller';

@Module({
  controllers: [SocialUsersController],
  providers: [
    GetSocialUserUseCase,
    SearchSocialUsersUseCase,
    FindByIdSql,
    SearchSql,
    { provide: SocialUsersQueries, useClass: PostgresSocialUsersQueries },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class SocialUsersModule {}
