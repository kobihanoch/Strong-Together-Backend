import { Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import type { ResetPasswordBody, ResetPasswordQuery, ResetPasswordResponse, CreatePasswordResetRequestBody } from '@strong-together/shared';
import { resetPasswordRequestSchema, createPasswordResetRequestSchema } from '@strong-together/shared';
import { PasswordService } from './password.service';
import { RateLimit, RateLimitGuard, resetPasswordEmailRateLimit, resetPasswordEmailRateLimitDaily } from '../../../common/guards/rate-limit.guard';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor';
import type { AppRequest } from '../../../common/types/express';

/**
 * Handles password HTTP requests.
 */
@Controller('api/auth')
@UseInterceptors(RlsTxInterceptor)
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  /**
   * Send a password-reset email when the submitted identifier matches an app user.
   *
   * Accepts a username or email address and dispatches a reset email without
   * revealing whether the account exists.
   *
   * @remarks Route: POST /api/auth/password-reset-requests
   * Access: Public
   *
   * @param data - The validated request data.
   * @param req - The HTTP request.
   */
  @Post('password-reset-requests')
  @UseGuards(RateLimitGuard)
  @RateLimit(resetPasswordEmailRateLimitDaily, resetPasswordEmailRateLimit)
  async createPasswordResetRequest(
    @RequestData(new ValidateRequestPipe(createPasswordResetRequestSchema))
    data: { body: CreatePasswordResetRequestBody },
    @Req() req: AppRequest,
  ): Promise<void> {
    await this.passwordService.createPasswordResetRequestData(data.body, req.requestId);
  }

  /**
   * Reset a user's password from a password-reset link.
   *
   * Validates the reset token, enforces one-time use through the JTI cache,
   * updates the stored password hash, and invalidates older sessions by bumping
   * token version state.
   *
   * @remarks Route: POST /api/auth/password-resets
   * Access: Public
   *
   * @param data - The validated request data.
   * @returns The response payload.
   */
  @Post('password-resets')
  async resetPassword(
    @RequestData(new ValidateRequestPipe(resetPasswordRequestSchema))
    data: {
      body: ResetPasswordBody;
      query: ResetPasswordQuery;
    },
  ): Promise<ResetPasswordResponse> {
    return this.passwordService.resetPasswordData(data.query.token, data.body.newPassword);
  }
}
