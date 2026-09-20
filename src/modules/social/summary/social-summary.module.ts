import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { SocialSummaryRepository } from './application/ports/social-summary.repository';
import { GetSocialSummaryUseCase } from './application/use-cases/get-social-summary.use-case';
import { PostgresSocialSummaryRepository } from './infrastructure/postgres-social-summary.repository';
import { SocialSummarySql } from './infrastructure/social-summary.sql';
import { SocialSummaryController } from './presentation/social-summary.controller';

@Module({
  controllers: [SocialSummaryController],
  providers: [
    GetSocialSummaryUseCase,
    SocialSummarySql,
    { provide: SocialSummaryRepository, useClass: PostgresSocialSummaryRepository },
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class SocialSummaryModule {}
