import { Controller, Get, Patch, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type { UpdateUnverifiedAccountEmailBody, GetVerificationStatusQuery, CreateVerificationEmailBody, VerifyEmailQuery } from '@strong-together/shared';
import {
  updateUnverifiedAccountEmailRequestSchema,
  getVerificationStatusRequestSchema,
  createVerificationEmailRequestSchema,
  verifyEmailRequestSchema,
} from '@strong-together/shared';
import { VerificationService } from './verification.service';
import {
  RateLimit,
  RateLimitGuard,
  changeVerificationEmailRateLimit,
  changeVerificationEmailRateLimitDaily,
} from '../../../common/guards/rate-limit.guard';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor';
import type { AppRequest } from '../../../common/types/express';

/**
 * Handles verification HTTP requests.
 */
@Controller('api/auth')
@UseInterceptors(RlsTxInterceptor)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  /**
   * Complete account verification from an email verification link.
   *
   * Validates the verification token, enforces single-use semantics through the
   * JTI cache, updates the user's verification state, and returns an HTML result
   * page.
   *
   * @remarks Route: GET /api/auth/email-verification
   * Access: Public
   *
   * @param data - The validated request data.
   * @param res - The HTTP response.
   */
  @Get('email-verification')
  async verifyEmail(
    @RequestData(new ValidateRequestPipe(verifyEmailRequestSchema))
    data: { query: VerifyEmailQuery },
    @Res() res: Response,
  ): Promise<void> {
    const { statusCode, html } = await this.verificationService.verifyEmailData(data.query.token);
    res.status(statusCode).type('html').set('Cache-Control', 'no-store').send(html);
  }

  /**
   * Send a new verification email when the submitted address belongs to a user.
   *
   * Resolves the user by email and, when found, dispatches a fresh verification
   * email without exposing whether the address exists.
   *
   * @remarks Route: POST /api/auth/verification-emails
   * Access: Public
   *
   * @param data - The validated request data.
   * @param req - The HTTP request.
   */
  @Post('verification-emails')
  @UseGuards(RateLimitGuard)
  @RateLimit(changeVerificationEmailRateLimitDaily, changeVerificationEmailRateLimit)
  async createVerificationEmail(
    @RequestData(new ValidateRequestPipe(createVerificationEmailRequestSchema))
    data: { body: CreateVerificationEmailBody },
    @Req() req: AppRequest,
  ): Promise<void> {
    await this.verificationService.createVerificationEmailData(data.body, req.requestId);
  }

  /**
   * Change the email address of an unverified account and send a new verification email.
   *
   * Re-authenticates the caller with username and password, updates the pending
   * email address when allowed, and dispatches a fresh verification email to the
   * new address.
   *
   * @remarks Route: PATCH /api/auth/unverified-account/email
   * Access: Public
   *
   * @param data - The validated request data.
   * @param req - The HTTP request.
   */
  @Patch('unverified-account/email')
  @UseGuards(RateLimitGuard)
  @RateLimit(changeVerificationEmailRateLimitDaily, changeVerificationEmailRateLimit)
  async updateUnverifiedAccountEmail(
    @RequestData(new ValidateRequestPipe(updateUnverifiedAccountEmailRequestSchema))
    data: { body: UpdateUnverifiedAccountEmailBody },
    @Req() req: AppRequest,
  ): Promise<void> {
    await this.verificationService.updateUnverifiedAccountEmailData(data.body, req.requestId);
  }

  /**
   * Check whether a username belongs to a verified account.
   *
   * Returns a minimal verification-state payload for the supplied username.
   *
   * @remarks Route: GET /api/auth/verification-status
   * Access: Public
   *
   * @param data - The validated request data.
   * @returns The response payload.
   */
  @Get('verification-status')
  async getVerificationStatus(
    @RequestData(new ValidateRequestPipe(getVerificationStatusRequestSchema))
    data: {
      query: GetVerificationStatusQuery;
    },
  ): Promise<{ isVerified: boolean }> {
    return this.verificationService.getVerificationStatusData(data.query.username);
  }
}
