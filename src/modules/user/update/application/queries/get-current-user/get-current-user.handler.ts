import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { UserNotFoundError } from '../../errors/update-user.errors';
import type { UserProfile } from '../../models/update-user.models';
import { UserProfileQueries } from '../../ports/user-profile.queries';
import { GetCurrentUserQuery } from './get-current-user.query';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
/** Retrieves the authenticated user's profile. */
@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserHandler implements IQueryHandler<GetCurrentUserQuery> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly query: UserProfileQueries,
  ) {}
  /**
   * Retrieves a user profile.
   *
   * @param userId - The user identifier.
   * @returns The profile.
   * @throws {UserNotFoundError} When the user is absent.
   */
  async execute(query: GetCurrentUserQuery): Promise<UserProfile> {
    const { userId } = query;
    return this.unitOfWork.executeReadOnly(userId, async () => {
      const user = await this.query.find();
      if (!user) throw new UserNotFoundError();
      return user;
    });
  }
}
