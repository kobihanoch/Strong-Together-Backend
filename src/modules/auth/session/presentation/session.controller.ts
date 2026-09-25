import { Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type { LoginRequestBody, LoginResponse, LogoutResponse, RefreshTokenResponse } from '@strong-together/shared';
import { loginRequestSchema } from '@strong-together/shared';
import { LoginUseCase } from '../application/commands/login.use-case';
import { LogoutUseCase } from '../application/commands/logout.use-case';
import { RefreshSessionUseCase } from '../application/commands/refresh-session.use-case';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { RateLimit, RateLimitGuard, loginIpRateLimit, loginRateLimit } from '../../../../common/guards/rate-limit.guard';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AppRequest } from '../../../../common/types/express';
import { getRefreshToken } from './refresh-token.extractor';

/** H */
@Controller('api/auth')
export class SessionController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
  ) {}

  /**
   * Authenticate a user with credentials and issue fresh access tokens.
   *
   * Validates the submitted credentials, enforces DPoP key binding when enabled,
   * performs first-login side effects when needed, and returns a fresh access and
   * refresh token pair.
   *
   * API: `POST /api/auth/login`.
   * Authorized roles: None (public endpoint).
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `429 Too Many Requests`.
   *
   * @param data - The validated request data.
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @returns The response payload.
   * @throws {BadRequestException} When request validation fails.
   * @throws {SessionBadRequestError} When required DPoP binding is missing.
   * @throws {SessionUnauthorizedError} When credentials or verification state are invalid.
   * @throws {HttpException} When the rate limit is exceeded.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RateLimitGuard)
  @RateLimit(loginRateLimit, loginIpRateLimit)
  async loginUser(
    @RequestData(new ValidateRequestPipe(loginRequestSchema))
    data: { body: LoginRequestBody },
    @Req() req: AppRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const { identifier, password } = data.body;
    const jkt = req.headers['dpop-key-binding'] as string | undefined;
    const payload = await this.loginUseCase.execute(identifier, password, jkt);

    res.set('Cache-Control', 'no-store');
    return payload;
  }

  /**
   * Invalidate the authenticated user's current session.
   *
   * Decodes the submitted refresh token when present, clears the stored push
   * token, bumps token version state, and returns a success message.
   *
   * API: `POST /api/auth/logout`.
   * Authorized roles: None (public endpoint).
   * HTTP responses: `200 OK`; `401 Unauthorized`.
   *
   * @param req - The HTTP request.
   * @returns The response payload.
   * @throws {SessionUnauthorizedError} When the refresh token or DPoP proof is invalid.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(DpopGuard)
  async logoutUser(@Req() req: AppRequest): Promise<LogoutResponse> {
    const jkt = req.dpopJkt;
    const refreshToken = getRefreshToken(req);
    await this.logoutUseCase.execute(refreshToken, jkt);
    return { message: 'Logged out successfully' };
  }

  /**
   * Refresh the caller's token pair using a valid refresh token.
   *
   * Validates the refresh token, enforces DPoP proof binding when enabled,
   * rotates token version state, and returns a fresh access and refresh token
   * pair.
   *
   * API: `POST /api/auth/refresh`.
   * Authorized roles: None (public endpoint).
   * HTTP responses: `200 OK`; `401 Unauthorized`.
   *
   * @param req - The HTTP request.
   * @param res - The HTTP response.
   * @returns The response payload.
   * @throws {SessionUnauthorizedError} When the session, refresh token, or DPoP proof is invalid.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(DpopGuard)
  async refreshAccessToken(@Req() req: AppRequest, @Res({ passthrough: true }) res: Response): Promise<RefreshTokenResponse> {
    const dpopJkt = req.dpopJkt;
    const refreshToken = getRefreshToken(req);
    const payload = await this.refreshSessionUseCase.execute(refreshToken, dpopJkt);

    res.set('Cache-Control', 'no-store');
    return payload;
  }
}
