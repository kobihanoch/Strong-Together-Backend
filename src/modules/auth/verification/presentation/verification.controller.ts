import { Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type {
  UpdateUnverifiedAccountEmailBody,
  GetVerificationStatusQuery,
  CreateVerificationEmailBody,
  VerifyEmailQuery,
} from '@strong-together/shared';
import {
  updateUnverifiedAccountEmailRequestSchema,
  getVerificationStatusRequestSchema,
  createVerificationEmailRequestSchema,
  verifyEmailRequestSchema,
} from '@strong-together/shared';
import { CreateVerificationEmailUseCase } from '../application/commands/create-verification-email.use-case';
import { GetVerificationStatusUseCase } from '../application/queries/get-verification-status.use-case';
import { UpdateUnverifiedEmailUseCase } from '../application/commands/update-unverified-email.use-case';
import { VerifyEmailUseCase } from '../application/commands/verify-email.use-case';
import { generateVerificationFailedHTML, generateVerifiedHTML } from './verification.views';
import {
  RateLimit,
  RateLimitGuard,
  changeVerificationEmailRateLimit,
  changeVerificationEmailRateLimitDaily,
} from '../../../../common/guards/rate-limit.guard';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AppRequest } from '../../../../common/types/express';

/** H */
@Controller('api/auth')
export class VerificationController {
  constructor(
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly createVerificationEmailUseCase: CreateVerificationEmailUseCase,
    private readonly updateUnverifiedEmailUseCase: UpdateUnverifiedEmailUseCase,
    private readonly getVerificationStatusUseCase: GetVerificationStatusUseCase,
  ) {}

  /**
   * Complete account verification from an email verification link.
   *
   * Validates the verification token, enforces single-use semantics through the
   * JTI cache, updates the user's verification state, and returns an HTML result
   * page.
   *
   * API: `GET /api/auth/email-verification`.
   * Authorized roles: None (public endpoint).
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`.
   *
   * @param data - The validated request data.
   * @param res - The HTTP response.
   * @returns A promise that resolves when the operation completes.
   * @throws {BadRequestException} When request validation fails.
   * @throws {VerificationBadRequestError} When the verification token is missing.
   */
  @Get('email-verification')
  async verifyEmail(
    @RequestData(new ValidateRequestPipe(verifyEmailRequestSchema))
    data: { query: VerifyEmailQuery },
    @Res() res: Response,
  ): Promise<void> {
    const outcome = await this.verifyEmailUseCase.execute(data.query.token);
    const statusCode = outcome === 'verified' ? 200 : outcome === 'unauthorized' ? 401 : 400;
    const html = outcome === 'verified' ? generateVerifiedHTML() : generateVerificationFailedHTML();
    res.status(statusCode).type('html').set('Cache-Control', 'no-store').send(html);
  }

  /**
   * Send a new verification email when the submitted address belongs to a user.
   *
   * Resolves the user by email and, when found, dispatches a fresh verification
   * email without exposing whether the address exists.
   *
   * API: `POST /api/auth/verification-emails`.
   * Authorized roles: None (public endpoint).
   * HTTP responses: `201 Created`; `400 Bad Request`; `429 Too Many Requests`.
   *
   * @param data - The validated request data.
   * @param req - The HTTP request.
   * @returns A promise that resolves without disclosing account existence.
   * @throws {BadRequestException} When request validation fails.
   * @throws {HttpException} When the rate limit is exceeded.
   */
  @Post('verification-emails')
  @UseGuards(RateLimitGuard)
  @RateLimit(changeVerificationEmailRateLimitDaily, changeVerificationEmailRateLimit)
  async createVerificationEmail(
    @RequestData(new ValidateRequestPipe(createVerificationEmailRequestSchema))
    data: { body: CreateVerificationEmailBody },
    @Req() req: AppRequest,
  ): Promise<void> {
    await this.createVerificationEmailUseCase.execute(data.body.email, req.requestId);
  }

  /**
   * Change the email address of an unverified account and send a new verification email.
   *
   * Re-authenticates the caller with username and password, updates the pending
   * email address when allowed, and dispatches a fresh verification email to the
   * new address.
   *
   * API: `PATCH /api/auth/unverified-account/email`.
   * Authorized roles: None (public endpoint).
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `409 Conflict`; `429 Too Many Requests`.
   *
   * @param data - The validated request data.
   * @param req - The HTTP request.
   * @returns A promise that resolves after the email is changed.
   * @throws {BadRequestException} When request validation fails.
   * @throws {VerificationBadRequestError} When the account is already verified.
   * @throws {VerificationUnauthorizedError} When credentials are invalid.
   * @throws {VerificationConflictError} When the replacement email is already used.
   * @throws {HttpException} When the rate limit is exceeded.
   */
  @Patch('unverified-account/email')
  @UseGuards(RateLimitGuard)
  @RateLimit(changeVerificationEmailRateLimitDaily, changeVerificationEmailRateLimit)
  async updateUnverifiedAccountEmail(
    @RequestData(new ValidateRequestPipe(updateUnverifiedAccountEmailRequestSchema))
    data: { body: UpdateUnverifiedAccountEmailBody },
    @Req() req: AppRequest,
  ): Promise<void> {
    await this.updateUnverifiedEmailUseCase.execute(data.body.username, data.body.password, data.body.newEmail, req.requestId);
  }

  /**
   * Check whether a username belongs to a verified account.
   *
   * Returns a minimal verification-state payload for the supplied username.
   *
   * API: `GET /api/auth/verification-status`.
   * Authorized roles: None (public endpoint).
   * HTTP responses: `200 OK`; `400 Bad Request`.
   *
   * @param data - The validated request data.
   * @returns The response payload.
   * @throws {BadRequestException} When request validation fails.
   */
  @Get('verification-status')
  async getVerificationStatus(
    @RequestData(new ValidateRequestPipe(getVerificationStatusRequestSchema))
    data: {
      query: GetVerificationStatusQuery;
    },
  ): Promise<{ isVerified: boolean }> {
    return this.getVerificationStatusUseCase.execute(data.query.username);
  }
}
