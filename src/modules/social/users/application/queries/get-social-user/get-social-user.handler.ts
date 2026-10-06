import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { SocialUserNotFoundError } from '../../errors/social-users.errors';
import type { SocialUserProfile } from '../../models/social-users.models';
import { SocialUsersQueries } from '../../ports/social-users.queries';
import { GetSocialUserQuery } from './get-social-user.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';

/** Retrieves one public social profile. */
@QueryHandler(GetSocialUserQuery)
export class GetSocialUserHandler implements IQueryHandler<GetSocialUserQuery> {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: SocialUsersQueries,
  ) {}

  /**
   * Retrieves a public profile by its user identifier.
   *
   * @param requestingUserId - The authenticated user making the request.
   * @param targetUserId - The user whose public profile is requested.
   * @returns The matching public profile.
   * @throws {SocialUserNotFoundError} When the user does not exist.
   */
  public async execute(query: GetSocialUserQuery): Promise<SocialUserProfile> {
    const { requestingUserId, targetUserId } = query;
    return this.unitOfWork.executeReadOnly(requestingUserId, async () => {
      const user = await this.query.findById(targetUserId);
      if (!user) throw new SocialUserNotFoundError();
      return user;
    });
  }
}
