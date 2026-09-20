import { Controller, Get, UseGuards } from '@nestjs/common';
import type { GetSocialUserParams, GetSocialUserResponse, SearchSocialUsersQuery, SearchSocialUsersResponse } from '@strong-together/shared';
import { getSocialUserRequestSchema, searchSocialUsersRequestSchema } from '@strong-together/shared';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import { GetSocialUserUseCase } from '../application/use-cases/get-social-user.use-case';
import { SearchSocialUsersUseCase } from '../application/use-cases/search-social-users.use-case';

/** Exposes authenticated social-user discovery endpoints. */
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
   * API: GET /api/social/users
   * Access: Authenticated user
   *
   * @param data - The validated search and cursor parameters.
   * @returns Matching users ordered from newest to oldest.
   */
  @Get()
  public search(
    @RequestData(new ValidateRequestPipe(searchSocialUsersRequestSchema)) data: { query: SearchSocialUsersQuery },
  ): Promise<SearchSocialUsersResponse> {
    return this.searchSocialUsers.execute(data.query.search, data.query.limit, data.query.cursor);
  }

  /**
   * Gets one user's public social profile.
   *
   * API: GET /api/social/users/:userId
   * Access: Authenticated user
   *
   * @param data - The validated user identifier.
   * @returns The user's public profile.
   * @throws {SocialUserNotFoundError} When the user does not exist.
   */
  @Get(':userId')
  public getUser(
    @RequestData(new ValidateRequestPipe(getSocialUserRequestSchema)) data: { params: GetSocialUserParams },
  ): Promise<GetSocialUserResponse> {
    return this.getSocialUser.execute(data.params.userId);
  }
}
