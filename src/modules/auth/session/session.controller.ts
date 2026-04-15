import { Controller, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { LoginRequestBody, LoginResponse, LogOutResponse, RefreshTokenResponse } from '@strong-together/shared';
import { loginRequest } from '@strong-together/shared';
import { createLogger } from '../../../infrastructure/logger.ts';
import type { AppLogger } from '../../../infrastructure/logger.ts';
import { getRefreshToken } from './session.utils.ts';
import { SessionService } from './session.service.ts';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard.ts';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard.ts';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard.ts';
import {
  RateLimit,
  RateLimitGuard,
  loginIpRateLimit,
  loginRateLimit,
} from '../../../common/guards/rate-limit.guard.ts';
import { CurrentLogger } from '../../../common/decorators/current-logger.decorator.ts';
import { RequestData } from '../../../common/decorators/request-data.decorator.ts';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe.ts';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor.ts';

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
   * Route: POST /api/auth/login
   * Access: Public
   */
  @Post('login')
  @UseGuards(RateLimitGuard)
  @RateLimit(loginRateLimit, loginIpRateLimit)
  async loginUser(
    @RequestData(new ValidateRequestPipe(loginRequest))
    data: { body: LoginRequestBody },
    @Req() req: Request,
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
   * Route: POST /api/auth/logout
   * Access: User
   */
  @Post('logout')
  @UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
  @Roles('user')
  async logoutUser(@Req() req: Request): Promise<LogOutResponse> {
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
   * Route: POST /api/auth/refresh
   * Access: Public
   */
  @Post('refresh')
  @UseGuards(DpopGuard)
  async refreshAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshTokenResponse> {
    const dpopJkt = req.dpopJkt;
    const refreshToken = getRefreshToken(req);
    const payload = await this.sessionService.refreshAccessTokenData(refreshToken, dpopJkt);

    res.set('Cache-Control', 'no-store');
    return payload;
  }
}
