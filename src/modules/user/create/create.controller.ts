import { Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type { CreateUserBody, CreateUserResponse } from '@strong-together/shared';
import { createUserRequestSchema } from '@strong-together/shared';
import { CurrentRequestId } from '../../../common/decorators/current-request-id.decorator';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import { CreateUserService } from './create.service';

/**
 * User-registration routes.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - POST /api/users
 *
 * Access: Public
 */
@Controller('api/users')
@UseInterceptors(RlsTxInterceptor)
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  /**
   * Register a new local user account.
   *
   * Creates the user, initializes default reminder settings, and sends the first
   * verification email.
   *
   * @remarks Route: POST /api/users
   * Access: Public
   *
   * @param data - The validated request data.
   * @param requestId - The request id.
   * @param res - The HTTP response.
   * @returns The response payload.
   */
  @Post()
  async createUser(
    @RequestData(new ValidateRequestPipe(createUserRequestSchema))
    data: { body: CreateUserBody },
    @CurrentRequestId() requestId: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CreateUserResponse> {
    const payload = await this.createUserService.createUserData(data.body, requestId);
    res.status(201);
    return payload;
  }
}
