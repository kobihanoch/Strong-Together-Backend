import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { AppleOAuthBody, OAuthLoginResponse } from '@strong-together/shared';
import { appleOAuthRequestSchema } from '@strong-together/shared';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { RateLimit, RateLimitGuard, loginRateLimit } from '../../../../common/guards/rate-limit.guard';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import { validateJkt } from '../../core/presentation/oauth-request.utils';
import { SignInWithAppleUseCase } from '../application/commands/sign-in-with-apple.use-case';

/** OAuth routes for Apple sign-in. */
@Controller('api/oauth')
export class AppleController {
  constructor(private readonly signInWithAppleUseCase: SignInWithAppleUseCase) {}

  /**
   * Authenticate or register a user with Apple OAuth.
   *
   * Verifies the Apple identity token, links or creates the local user record as
   * needed, and returns the session payload.
   *
   * API: `POST /api/oauth/apple`.
   * Authorized roles: None (public endpoint).
   * HTTP responses: `201 Created`; `400 Bad Request`; `401 Unauthorized`; `429 Too Many Requests`; `500 Internal Server Error`.
   *
   * @param data - The validated request data.
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @returns The response payload.
   * @throws {BadRequestException} When request validation fails.
   * @throws {InvalidAppleOAuthError} When the Apple identity token is invalid.
   * @throws {AppleOAuthUnauthorizedError} When the account cannot start a session.
   * @throws {Error} When verified Apple claims contain an invalid nonce.
   * @throws {HttpException} When the rate limit is exceeded.
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
