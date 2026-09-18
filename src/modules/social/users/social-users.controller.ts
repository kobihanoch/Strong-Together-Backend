import { Controller, Get, UseGuards } from '@nestjs/common';
import type { GetSocialUserParams, GetSocialUserResponse, SearchSocialUsersQuery, SearchSocialUsersResponse } from '@strong-together/shared';
import { getSocialUserRequestSchema, searchSocialUsersRequestSchema } from '@strong-together/shared';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import { SocialUsersService } from './social-users.service';

/** Exposes authenticated social user discovery. */
@Controller('api/social/users')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class SocialUsersController {
  public constructor(private readonly service: SocialUsersService) {}

  /**
   * Searches public user profile fields by username or full name.
   *
   * @remarks Route: GET /api/social/users?search=text. Access: User.
   * @param data - The validated search text and cursor pagination.
   * @returns Matching users ordered from newest to oldest.
   */
  @Get()
  public search(
    @RequestData(new ValidateRequestPipe(searchSocialUsersRequestSchema)) data: { query: SearchSocialUsersQuery },
  ): Promise<SearchSocialUsersResponse> {
    return this.service.searchUser(data.query.search, data.query.limit, data.query.cursor);
  }

  /**
   * Gets one user's public social profile by ID.
   *
   * @remarks Route: GET /api/social/users/:userId. Access: User.
   * @param data - The validated user ID.
   * @returns The user's public profile.
   * @throws NotFoundException when the user does not exist.
   */
  @Get(':userId')
  public getUser(
    @RequestData(new ValidateRequestPipe(getSocialUserRequestSchema)) data: { params: GetSocialUserParams },
  ): Promise<GetSocialUserResponse> {
    return this.service.getUser(data.params.userId);
  }
}
