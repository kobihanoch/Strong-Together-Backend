import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { decodeSocialCursor, encodeSocialCursor } from '../../../core/application/cursor-pagination';
import type { SocialUsersSearchResult } from '../models/social-users.models';
import { SocialUsersRepository } from '../ports/social-users.repository';

/** Searches public social profiles with stable cursor pagination. */
@Injectable()
export class SearchSocialUsersUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: SocialUsersRepository,
  ) {}

  /**
   * Searches public profiles by username or full name.
   *
   * @param search - Text matched against public profile names.
   * @param limit - Maximum number of profiles returned.
   * @param cursor - Opaque cursor from the previous page.
   * @returns The matching profiles and an optional continuation cursor.
   */
  public async execute(userId: string, search: string, limit: number, cursor?: string): Promise<SocialUsersSearchResult> {
    return this.unitOfWork.execute(userId, async () => {
      const rows = await this.repository.search(search, limit, decodeSocialCursor(cursor));
      const users = rows.slice(0, limit);
      const last = users.at(-1);

      return {
        users,
        nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.userId }) : null,
      };
    });
  }
}
