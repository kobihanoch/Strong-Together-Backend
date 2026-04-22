import { Controller, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { AppleOAuthBody, OAuthLoginResponse } from '@strong-together/shared';
import { appleOAuthRequest } from '@strong-together/shared';
import { CurrentLogger } from '../../../common/decorators/current-logger.decorator';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { RateLimit, RateLimitGuard, loginRateLimit } from '../../../common/guards/rate-limit.guard';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import type { AppLogger } from '../../../infrastructure/logger';
import { validateJkt } from '../oauth.utils';
import { AppleService } from './apple.service';

/**
 * OAuth routes for Apple sign-in.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - POST /api/oauth/apple
 *
 * Access: Public
 */
@Controller('api/oauth')
@UseInterceptors(RlsTxInterceptor)
export class AppleController {
  constructor(private readonly appleService: AppleService) {}

  /**
   * Authenticate or register a user with Apple OAuth.
   *
   * Verifies the Apple identity token, links or creates the local user record as
   * needed, and returns the session payload.
   *
   * Route: POST /api/oauth/apple
   * Access: Public
   */
  @Post('apple')
  @UseGuards(RateLimitGuard)
  @RateLimit(loginRateLimit)
  async createOrSignInWithApple(
    @RequestData(new ValidateRequestPipe(appleOAuthRequest))
    data: { body: AppleOAuthBody },
    @Req() req: Request,
    @CurrentLogger() requestLogger: AppLogger,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OAuthLoginResponse> {
    const jkt = validateJkt(req);
    const payload = await this.appleService.createOrSignInWithAppleData(data.body, jkt, requestLogger);

    res.set('Cache-Control', 'no-store');
    return payload;
  }
}
