import { Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import type { CreateUserBody, CreateUserResponse } from '@strong-together/shared';
import { createUserRequest } from '@strong-together/shared';
import { CurrentRequestId } from '../../../common/decorators/current-request-id.decorator.ts';
import { RequestData } from '../../../common/decorators/request-data.decorator.ts';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor.ts';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe.ts';
import { CreateUserService } from './create.service.ts';

/**
 * User-registration routes.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - POST /api/users/create
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
   * Route: POST /api/users/create
   * Access: Public
   */
  @Post('create')
  async createUser(
    @RequestData(new ValidateRequestPipe(createUserRequest))
    data: { body: CreateUserBody },
    @CurrentRequestId() requestId: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CreateUserResponse> {
    const payload = await this.createUserService.createUserData(data.body, requestId);
    res.status(201);
    return payload;
  }
}
