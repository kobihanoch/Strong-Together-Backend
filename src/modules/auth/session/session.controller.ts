import { Controller, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type { LoginRequestBody, LoginResponse, LogoutResponse, RefreshTokenResponse } from '@strong-together/shared';
import { loginRequestSchema } from '@strong-together/shared';
import type { AppLogger } from '../../../infrastructure/logger';
import { getRefreshToken } from './session.utils';
import { SessionService } from './session.service';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { AuthenticationGuard } from '../../../common/guards/auth/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/auth/authorization.guard';
import { RateLimit, RateLimitGuard, loginIpRateLimit, loginRateLimit } from '../../../common/guards/rate-limit.guard';
import { CurrentLogger } from '../../../common/decorators/current-logger.decorator';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor';
import type { AppRequest } from '../../../common/types/express';

/**
 * Handles session HTTP requests.
 */
@Controller('api/auth')
@UseInterceptors(RlsTxInterceptor)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * Authenticate a user with credentials and issue fresh access tokens.
   *
   * Validates the submitted credentials, enforces DPoP key binding when enabled,
   * performs first-login side effects when needed, and returns a fresh access and
   * refresh token pair.
   *
   * @remarks Route: POST /api/auth/login
   * Access: Public
   *
   * @param data - The validated request data.
   * @param req - The HTTP request.
   * @param requestLogger - The request-scoped logger.
   * @param res - The HTTP response.
   * @returns The response payload.
   */
  @Post('login')
  @UseGuards(RateLimitGuard)
  @RateLimit(loginRateLimit, loginIpRateLimit)
  async loginUser(
    @RequestData(new ValidateRequestPipe(loginRequestSchema))
    data: { body: LoginRequestBody },
    @Req() req: AppRequest,
    @CurrentLogger() requestLogger: AppLogger,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const { identifier, password } = data.body;
    const jkt = req.headers['dpop-key-binding'] as string | undefined;
    const payload = await this.sessionService.loginUserData(identifier, password, jkt, requestLogger);

    res.set('Cache-Control', 'no-store');
    return payload;
  }

  /**
   * Invalidate the authenticated user's current session.
   *
   * Decodes the submitted refresh token when present, clears the stored push
   * token, bumps token version state, and returns a success message.
   *
   * @remarks Route: POST /api/auth/logout
   * Access: User
   *
   * @param req - The HTTP request.
   * @returns The response payload.
   */
  @Post('logout')
  @UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @Roles('user')
  async logoutUser(@Req() req: AppRequest): Promise<LogoutResponse> {
    const refreshToken = getRefreshToken(req);
    await this.sessionService.logoutUserData(refreshToken);
    return { message: 'Logged out successfully' };
  }

  /**
   * Refresh the caller's token pair using a valid refresh token.
   *
   * Validates the refresh token, enforces DPoP proof binding when enabled,
   * rotates token version state, and returns a fresh access and refresh token
   * pair.
   *
   * @remarks Route: POST /api/auth/refresh
   * Access: Public
   *
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @returns The response payload.
   */
  @Post('refresh')
  @UseGuards(DpopGuard)
  async refreshAccessToken(@Req() req: AppRequest, @Res({ passthrough: true }) res: Response): Promise<RefreshTokenResponse> {
    const dpopJkt = req.dpopJkt;
    const refreshToken = getRefreshToken(req);
    const payload = await this.sessionService.refreshAccessTokenData(refreshToken, dpopJkt);

    res.set('Cache-Control', 'no-store');
    return payload;
  }
}
