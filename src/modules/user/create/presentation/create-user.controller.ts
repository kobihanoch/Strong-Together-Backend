import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import type { CreateUserBody } from '@strong-together/shared';
import { createUserRequestSchema } from '@strong-together/shared';
import { CurrentRequestId } from '../../../../common/decorators/current-request-id.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import { CreateUserUseCase } from '../application/commands/create-user.use-case';

/** E */
@Controller('api/users')
export class CreateUserController {
  constructor(private readonly createUser: CreateUserUseCase) {}
  /**
   * Registers a local user and schedules account verification.
   *
   * API: `POST /api/users`.
   * Authorized roles: None (public endpoint).
   * HTTP responses: `201 Created`; `400 Bad Request`.
   *
   * @param data - Validated registration data.
   * @param requestId - Optional request correlation identifier.
   * @returns No response body.
   * @throws {UserAlreadyExistsError} When the username or email is already used.
   * @throws {BadRequestException} When request validation fails.
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
