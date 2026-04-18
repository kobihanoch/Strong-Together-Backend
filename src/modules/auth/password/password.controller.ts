import { Controller, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import type {
  ResetPasswordBody,
  ResetPasswordQuery,
  ResetPasswordResponse,
  SendChangePassEmailBody,
} from '@strong-together/shared';
import { resetPasswordRequest, sendChangePassEmailRequest } from '@strong-together/shared';
import { PasswordService } from './password.service';
import {
  RateLimit,
  RateLimitGuard,
  resetPasswordEmailRateLimit,
  resetPasswordEmailRateLimitDaily,
} from '../../../common/guards/rate-limit.guard';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor';
import type { AppRequest } from '../../../common/types/express';

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
   * Route: POST /api/auth/forgotpassemail
   * Access: Public
   */
  @Post('forgotpassemail')
  @UseGuards(RateLimitGuard)
  @RateLimit(resetPasswordEmailRateLimitDaily, resetPasswordEmailRateLimit)
  async sendChangePassEmail(
    @RequestData(new ValidateRequestPipe(sendChangePassEmailRequest))
    data: { body: SendChangePassEmailBody },
    @Req() req: AppRequest,
  ): Promise<void> {
    await this.passwordService.sendChangePassEmailData(data.body, req.requestId);
  }

  /**
   * Reset a user's password from a password-reset link.
   *
   * Validates the reset token, enforces one-time use through the JTI cache,
   * updates the stored password hash, and invalidates older sessions by bumping
   * token version state.
   *
   * Route: PUT /api/auth/resetpassword
   * Access: Public
   */
  @Put('resetpassword')
  async resetPassword(
    @RequestData(new ValidateRequestPipe(resetPasswordRequest))
    data: {
      body: ResetPasswordBody;
      query: ResetPasswordQuery;
    },
  ): Promise<ResetPasswordResponse> {
    return this.passwordService.resetPasswordData(data.query.token, data.body.newPassword);
  }
}
