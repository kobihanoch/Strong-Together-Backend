import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { UserProfileRepository } from '../ports/user-profile.repository';
/** Deletes the authenticated user's account. */
@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: UserProfileRepository,
  ) {}
  /**
   * Deletes a user.
   *
   * @param userId - The user identifier.
   * @returns Nothing.
   */
  async execute(userId: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.delete(userId);
    });
  }
}
