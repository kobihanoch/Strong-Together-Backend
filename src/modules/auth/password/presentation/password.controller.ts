import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import type { ResetPasswordBody, ResetPasswordQuery, CreatePasswordResetRequestBody } from '@strong-together/shared';
import { resetPasswordRequestSchema, createPasswordResetRequestSchema } from '@strong-together/shared';
import { CreatePasswordResetRequestUseCase } from '../application/use-cases/create-password-reset-request.use-case';
import { ResetPasswordUseCase } from '../application/use-cases/reset-password.use-case';
import { RateLimit, RateLimitGuard, resetPasswordEmailRateLimit, resetPasswordEmailRateLimitDaily } from '../../../../common/guards/rate-limit.guard';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AppRequest } from '../../../../common/types/express';

/**
 * Handles password HTTP requests.
 */
@Controller('api/auth')
export class PasswordController {
  constructor(
    private readonly createPasswordResetRequestUseCase: CreatePasswordResetRequestUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  /**
   * Send a password-reset email when the submitted identifier matches an app user.
   *
   * Accepts a username or email address and dispatches a reset email without
   * revealing whether the account exists.
   *
   * API: POST /api/auth/password-reset-requests
   * Access: Public
   *
   * @param data - The validated request data.
   * @param req - The HTTP request.
   * @returns A promise that resolves without disclosing account existence.
   */
  @Post('password-reset-requests')
  @UseGuards(RateLimitGuard)
  @RateLimit(resetPasswordEmailRateLimitDaily, resetPasswordEmailRateLimit)
  async createPasswordResetRequest(
    @RequestData(new ValidateRequestPipe(createPasswordResetRequestSchema))
    data: { body: CreatePasswordResetRequestBody },
    @Req() req: AppRequest,
  ): Promise<void> {
    await this.createPasswordResetRequestUseCase.execute(data.body.identifier, req.requestId);
  }

  /**
   * Reset a user's password from a password-reset link.
   *
   * Validates the reset token, enforces one-time use through the JTI cache,
   * updates the stored password hash, invalidates older sessions by bumping
   * token version state, and responds with 204 No Content.
   *
   * API: POST /api/auth/password-resets
   * Access: Public
   *
   * @param data - The validated request data.
   * @returns A promise that resolves with no response body after reset.
   */
  @Post('password-resets')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(
    @RequestData(new ValidateRequestPipe(resetPasswordRequestSchema))
    data: {
      body: ResetPasswordBody;
      query: ResetPasswordQuery;
    },
  ): Promise<void> {
    await this.resetPasswordUseCase.execute(data.query.token, data.body.newPassword);
  }
}
