import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { SocialUsersRepository } from './application/ports/social-users.repository';
import { GetSocialUserUseCase } from './application/use-cases/get-social-user.use-case';
import { SearchSocialUsersUseCase } from './application/use-cases/search-social-users.use-case';
import { PostgresSocialUsersRepository } from './infrastructure/postgres-social-users.repository';
import { SocialUsersSql } from './infrastructure/social-users.sql';
import { SocialUsersController } from './presentation/social-users.controller';

@Module({
  controllers: [SocialUsersController],
  providers: [
    GetSocialUserUseCase,
    SearchSocialUsersUseCase,
    SocialUsersSql,
    { provide: SocialUsersRepository, useClass: PostgresSocialUsersRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class SocialUsersModule {}
