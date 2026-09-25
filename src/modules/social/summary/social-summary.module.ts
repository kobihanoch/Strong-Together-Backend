import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { SocialSummaryQueries } from './application/ports/social-summary.queries';
import { GetSocialSummaryUseCase } from './application/queries/get-social-summary.use-case';
import { PostgresSocialSummaryQueries } from './infrastructure/persistence/postgres-social-summary.queries';
import { GetSql } from './infrastructure/persistence/reads/get.sql';
import { SocialSummaryController } from './presentation/social-summary.controller';

@Module({
  controllers: [SocialSummaryController],
  providers: [
    GetSocialSummaryUseCase,
    GetSql,
    { provide: SocialSummaryQueries, useClass: PostgresSocialSummaryQueries },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class SocialSummaryModule {}
