import { Injectable } from '@nestjs/common';
import { UserProfileRepository } from '../ports/user-profile.repository';
/** Deletes the authenticated user's account. */
@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly repository: UserProfileRepository) {}
  /**
   * Deletes a user.
   *
   * @param userId - The user identifier.
   * @returns Nothing.
   */
  async execute(userId: string): Promise<void> {
    await this.repository.delete(userId);
  }
}
