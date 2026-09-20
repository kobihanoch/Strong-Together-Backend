import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import type { CreateUserBody } from '@strong-together/shared';
import { createUserRequestSchema } from '@strong-together/shared';
import { CurrentRequestId } from '../../../../common/decorators/current-request-id.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';

/** Exposes public user-registration endpoints. */
@Controller('api/users')
export class CreateUserController {
  constructor(private readonly createUser: CreateUserUseCase) {}
  /**
   * Registers a local user and schedules account verification.
   * API: POST /api/users
   * Access: Public
   * @param data - Validated registration data.
   * @param requestId - Optional request correlation identifier.
   * @returns No response body.
   * @throws {UserAlreadyExistsError} When the username or email is already used.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @RequestData(new ValidateRequestPipe(createUserRequestSchema)) data: { body: CreateUserBody },
    @CurrentRequestId() requestId?: string,
  ): Promise<void> {
    await this.createUser.execute(data.body, requestId);
  }
}
