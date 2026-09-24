import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { UserNotFoundError } from '../errors/update-user.errors';
import type { UserProfile } from '../models/update-user.models';
import { UserProfileRepository } from '../ports/user-profile.repository';
/** Retrieves the authenticated user's profile. */
@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: UserProfileRepository,
  ) {}
  /**
   * Retrieves a user profile.
   *
   * @param userId - The user identifier.
   * @returns The profile.
   * @throws {UserNotFoundError} When the user is absent.
   */
  async execute(userId: string): Promise<UserProfile> {
    return this.unitOfWork.execute(userId, async () => {
      const user = await this.repository.find(userId);
      if (!user) throw new UserNotFoundError();
      return user;
    });
  }
}
