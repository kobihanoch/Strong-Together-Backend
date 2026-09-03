import { Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import type { CreateUserBody } from '@strong-together/shared';
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
   * Creates the user, initializes default reminder settings, sends the first
   * verification email, and responds with 201 Created without a response body.
   *
   * @remarks Route: POST /api/users
   * Access: Public
   *
   * @param data - The validated request data.
   * @param requestId - The request id.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @RequestData(new ValidateRequestPipe(createUserRequestSchema))
    data: { body: CreateUserBody },
    @CurrentRequestId() requestId: string | undefined,
  ): Promise<void> {
    await this.createUserService.createUserData(data.body, requestId);
  }
}
