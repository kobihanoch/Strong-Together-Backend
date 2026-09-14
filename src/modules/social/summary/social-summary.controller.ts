import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import type { GetSocialSummaryResponse } from '@strong-together/shared';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor';
import { SocialSummaryService } from './social-summary.service';

/**
 * Exposes the authenticated user's compact social overview.
 *
 * Routes:
 * - GET /api/social/summary
 *
 * @remarks
 * Every request passes DPoP validation, authentication, user-role
 * authorization, and the RLS transaction interceptor before reaching the
 * service layer.
 *
 * The summary reports the caller's number of active crew memberships and up
 * to three unique active co-members. The caller is excluded from participant
 * previews, and users shared across multiple crews appear only once.
 *
 * Access: User
 */
@Controller('api/social/summary')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class SocialSummaryController {
  public constructor(private readonly service: SocialSummaryService) {}

  /**
   * Gets the caller's active crew total and up to three unique co-members.
   *
   * @remarks Route: GET /api/social/summary. Access: User.
   * @returns The caller's social summary.
   */
  @Get()
  public getSummary(): Promise<GetSocialSummaryResponse> {
    return this.service.getSummary();
  }
}
