import { Controller, Get, UseGuards } from '@nestjs/common';
import type { GetSocialUserParams, GetSocialUserResponse, SearchSocialUsersQuery, SearchSocialUsersResponse } from '@strong-together/shared';
import { getSocialUserRequestSchema, searchSocialUsersRequestSchema } from '@strong-together/shared';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../../common/types/express';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import { GetSocialUserUseCase } from '../application/queries/get-social-user.use-case';
import { SearchSocialUsersUseCase } from '../application/queries/search-social-users.use-case';

/** E */
@Controller('api/social/users')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class SocialUsersController {
  public constructor(
    private readonly searchSocialUsers: SearchSocialUsersUseCase,
    private readonly getSocialUser: GetSocialUserUseCase,
  ) {}

  /**
   * Searches public user profile fields by username or full name.
   *
   * API: `GET /api/social/users`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated search and cursor parameters.
   * @returns Matching users ordered from newest to oldest.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get()
  public search(
    @RequestData(new ValidateRequestPipe(searchSocialUsersRequestSchema)) data: { query: SearchSocialUsersQuery },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SearchSocialUsersResponse> {
    return this.searchSocialUsers.execute(user.id, data.query.search, data.query.limit, data.query.cursor);
  }

  /**
   * Gets one user's public social profile.
   *
   * API: `GET /api/social/users/:userId`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated user identifier.
   * @returns The user's public profile.
   * @throws {SocialUserNotFoundError} When the user does not exist.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get(':userId')
  public getUser(
    @RequestData(new ValidateRequestPipe(getSocialUserRequestSchema)) data: { params: GetSocialUserParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetSocialUserResponse> {
    return this.getSocialUser.execute(user.id, data.params.userId);
  }
}
