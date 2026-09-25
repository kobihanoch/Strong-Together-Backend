import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { SocialUserNotFoundError } from '../errors/social-users.errors';
import type { SocialUserProfile } from '../models/social-users.models';
import { SocialUsersQueries } from '../ports/social-users.queries';

/** Retrieves one public social profile. */
@Injectable()
export class GetSocialUserUseCase {
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
  public async execute(requestingUserId: string, targetUserId: string): Promise<SocialUserProfile> {
    return this.unitOfWork.execute(requestingUserId, async () => {
      const user = await this.query.findById(targetUserId);
      if (!user) throw new SocialUserNotFoundError();
      return user;
    });
  }
}
