import { Controller, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { GoogleOAuthBody, OAuthLoginResponse } from '@strong-together/shared';
import { googleOAuthRequest } from '@strong-together/shared';
import { CurrentLogger } from '../../../common/decorators/current-logger.decorator.ts';
import { RequestData } from '../../../common/decorators/request-data.decorator.ts';
import { RateLimit, RateLimitGuard, loginRateLimit } from '../../../common/guards/rate-limit.guard.ts';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor.ts';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe.ts';
import type { AppLogger } from '../../../infrastructure/logger.ts';
import { validateJkt } from '../oauth.utils.ts';
import { GoogleService } from './google.service.ts';

/**
 * OAuth routes for Google sign-in.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - POST /api/oauth/google
 *
 * Access: Public
 */
@Controller('api/oauth')
@UseInterceptors(RlsTxInterceptor)
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  /**
   * Authenticate or register a user with Google OAuth.
   *
   * Verifies the Google identity token, links or creates the local user record as
   * needed, and returns the session payload.
   *
   * Route: POST /api/oauth/google
   * Access: Public
   */
  @Post('google')
  @UseGuards(RateLimitGuard)
  @RateLimit(loginRateLimit)
  async createOrSignInWithGoogle(
    @RequestData(new ValidateRequestPipe(googleOAuthRequest))
    data: { body: GoogleOAuthBody },
    @Req() req: Request,
    @CurrentLogger() requestLogger: AppLogger,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OAuthLoginResponse> {
    const jkt = validateJkt(req);
    const payload = await this.googleService.createOrSignInWithGoogleData(data.body, jkt, requestLogger);

    res.set('Cache-Control', 'no-store');
    return payload;
  }
}
