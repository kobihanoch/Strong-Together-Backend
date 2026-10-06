import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { SocialSummaryQueries } from './application/ports/social-summary.queries';
import { GetSocialSummaryHandler } from './application/queries/get-social-summary/get-social-summary.handler';
import { PostgresSocialSummaryQueries } from './infrastructure/persistence/postgres-social-summary.queries';
import { GetSql } from './infrastructure/persistence/reads/get.sql';
import { SocialSummaryController } from './presentation/social-summary.controller';

@Module({
  controllers: [SocialSummaryController],
  providers: [
    GetSocialSummaryHandler,
    GetSql,
    { provide: SocialSummaryQueries, useClass: PostgresSocialSummaryQueries },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class SocialSummaryModule {}
