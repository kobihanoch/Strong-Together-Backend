import { Controller, Get, Post, Put, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type {
  ChangeEmailAndVerifyBody,
  CheckUserVerifyQuery,
  SendVerifcationMailBody,
  VerifyUserAccountQuery,
} from '@strong-together/shared';
import {
  changeEmailAndVerifyRequest,
  checkUserVerifyRequest,
  sendVerificationMailRequest,
  verifyAccountRequest,
} from '@strong-together/shared';
import { VerificationService } from './verification.service.ts';
import {
  RateLimit,
  RateLimitGuard,
  changeVerificationEmailRateLimit,
  changeVerificationEmailRateLimitDaily,
} from '../../../common/guards/rate-limit.guard.ts';
import { RequestData } from '../../../common/decorators/request-data.decorator.ts';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe.ts';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor.ts';
import type { AppRequest } from '../../../common/types/express.ts';

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
   * Route: GET /api/auth/verify
   * Access: Public
   */
  @Get('verify')
  async verifyUserAccount(
    @RequestData(new ValidateRequestPipe(verifyAccountRequest))
    data: { query: VerifyUserAccountQuery },
    @Res() res: Response,
  ): Promise<void> {
    const { statusCode, html } = await this.verificationService.verifyUserAccountData(data.query.token);
    res.status(statusCode).type('html').set('Cache-Control', 'no-store').send(html);
  }

  /**
   * Send a new verification email when the submitted address belongs to a user.
   *
   * Resolves the user by email and, when found, dispatches a fresh verification
   * email without exposing whether the address exists.
   *
   * Route: POST /api/auth/sendverificationemail
   * Access: Public
   */
  @Post('sendverificationemail')
  @UseGuards(RateLimitGuard)
  @RateLimit(changeVerificationEmailRateLimitDaily, changeVerificationEmailRateLimit)
  async sendVerificationMail(
    @RequestData(new ValidateRequestPipe(sendVerificationMailRequest))
    data: { body: SendVerifcationMailBody },
    @Req() req: AppRequest,
  ): Promise<void> {
    await this.verificationService.sendVerificationMailData(data.body, req.requestId);
  }

  /**
   * Change the email address of an unverified account and send a new verification email.
   *
   * Re-authenticates the caller with username and password, updates the pending
   * email address when allowed, and dispatches a fresh verification email to the
   * new address.
   *
   * Route: PUT /api/auth/changeemailverify
   * Access: Public
   */
  @Put('changeemailverify')
  @UseGuards(RateLimitGuard)
  @RateLimit(changeVerificationEmailRateLimitDaily, changeVerificationEmailRateLimit)
  async changeEmailAndVerify(
    @RequestData(new ValidateRequestPipe(changeEmailAndVerifyRequest))
    data: { body: ChangeEmailAndVerifyBody },
    @Req() req: AppRequest,
  ): Promise<void> {
    await this.verificationService.changeEmailAndVerifyData(data.body, req.requestId);
  }

  /**
   * Check whether a username belongs to a verified account.
   *
   * Returns a minimal verification-state payload for the supplied username.
   *
   * Route: GET /api/auth/checkuserverify
   * Access: Public
   */
  @Get('checkuserverify')
  async checkUserVerify(
    @RequestData(new ValidateRequestPipe(checkUserVerifyRequest))
    data: {
      query: CheckUserVerifyQuery;
    },
  ): Promise<{ isVerified: boolean }> {
    return this.verificationService.checkUserVerifyData(data.query.username);
  }
}
