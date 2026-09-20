import { Injectable } from '@nestjs/common';
import { SocialUserNotFoundError } from '../errors/social-users.errors';
import type { SocialUserProfile } from '../models/social-users.models';
import { SocialUsersRepository } from '../ports/social-users.repository';

/** Retrieves one public social profile. */
@Injectable()
export class GetSocialUserUseCase {
  public constructor(private readonly repository: SocialUsersRepository) {}

  /**
   * Retrieves a public profile by its user identifier.
   *
   *
   * @param userId - The user whose public profile is requested.
   *
   * @returns The matching public profile.
   *
   * @throws {SocialUserNotFoundError} When the user does not exist.
   */
  public async execute(userId: string): Promise<SocialUserProfile> {
    const user = await this.repository.findById(userId);
    if (!user) throw new SocialUserNotFoundError();
    return user;
  }
}
