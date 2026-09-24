import { Controller, Get, UseGuards } from '@nestjs/common';
import type { GetSocialSummaryResponse } from '@strong-together/shared';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { GetSocialSummaryUseCase } from '../application/use-cases/get-social-summary.use-case';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../../common/types/express';

/** E */
@Controller('api/social/summary')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class SocialSummaryController {
  public constructor(private readonly getSocialSummary: GetSocialSummaryUseCase) {}

  /**
   * Gets the caller's active crew total and unique co-member previews.
   *
   * API: `GET /api/social/summary`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @returns The caller's social summary.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get()
  public getSummary(@CurrentUser() user: AuthenticatedUser): Promise<GetSocialSummaryResponse> {
    return this.getSocialSummary.execute(user.id);
  }
}
