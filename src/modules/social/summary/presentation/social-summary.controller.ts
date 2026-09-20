import { Controller, Get, UseGuards } from '@nestjs/common';
import type { GetSocialSummaryResponse } from '@strong-together/shared';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { GetSocialSummaryUseCase } from '../application/use-cases/get-social-summary.use-case';

/** Exposes the authenticated user's compact social overview. */
@Controller('api/social/summary')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class SocialSummaryController {
  public constructor(private readonly getSocialSummary: GetSocialSummaryUseCase) {}

  /**
   * Gets the caller's active crew total and unique co-member previews.
   *
   * API: GET /api/social/summary
   * Access: Authenticated user
   *
   * @returns The caller's social summary.
   */
  @Get()
  public getSummary(): Promise<GetSocialSummaryResponse> {
    return this.getSocialSummary.execute();
  }
}
