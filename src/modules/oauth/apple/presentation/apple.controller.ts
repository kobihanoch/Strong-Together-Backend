import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { AppleOAuthBody, OAuthLoginResponse } from '@strong-together/shared';
import { appleOAuthRequestSchema } from '@strong-together/shared';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { RateLimit, RateLimitGuard, loginRateLimit } from '../../../../common/guards/rate-limit.guard';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import { validateJkt } from '../../core/presentation/oauth-request.utils';
import { SignInWithAppleUseCase } from '../application/use-cases/sign-in-with-apple.use-case';

/**
 * OAuth routes for Apple sign-in.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - POST /api/oauth/apple
 *
 * Access: Public
 */
@Controller('api/oauth')
export class AppleController {
  constructor(private readonly signInWithAppleUseCase: SignInWithAppleUseCase) {}

  /**
   * Authenticate or register a user with Apple OAuth.
   *
   * Verifies the Apple identity token, links or creates the local user record as
   * needed, and returns the session payload.
   *
   * API: POST /api/oauth/apple
   * Access: Public
   *
   * @param data - The validated request data.
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @returns The response payload.
   */
  @Post('apple')
  @UseGuards(RateLimitGuard)
  @RateLimit(loginRateLimit)
  async createOrSignInWithApple(
    @RequestData(new ValidateRequestPipe(appleOAuthRequestSchema))
    data: { body: AppleOAuthBody },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OAuthLoginResponse> {
    const jkt = validateJkt(req);
    const payload = await this.signInWithAppleUseCase.execute(data.body, jkt);

    res.set('Cache-Control', 'no-store');
    return payload;
  }
}
