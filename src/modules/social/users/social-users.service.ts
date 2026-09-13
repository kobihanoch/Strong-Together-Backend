import { Injectable, NotFoundException } from '@nestjs/common';
import type { GetSocialUserResponse, SearchSocialUsersResponse } from '@strong-together/shared';
import { decodeSocialCursor, encodeSocialCursor } from '../cursor-pagination';
import { SocialUsersQueries } from './social-users.queries';

/** Builds paginated social user-search responses. */
@Injectable()
export class SocialUsersService {
  public constructor(private readonly queries: SocialUsersQueries) {}

  /**
   * Searches users and creates the cursor for the next page.
   *
   * @param search - Text matched against usernames and full names.
   * @param limit - Maximum users returned in this page.
   * @param cursor - Opaque cursor from the previous page.
   * @returns A page of public user profiles.
   */
  public async searchUser(search: string, limit: number, cursor?: string): Promise<SearchSocialUsersResponse> {
    const rows = await this.queries.querySearchUser(search, limit, decodeSocialCursor(cursor));
    const users = rows.slice(0, limit);
    const last = users.at(-1);

    return {
      users,
      nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.userId }) : null,
    };
  }

  /**
   * Gets one public user profile.
   *
   * @param userId - The user UUID to find.
   * @returns The matching public profile.
   * @throws NotFoundException when no user has the supplied ID.
   */
  public async getUser(userId: string): Promise<GetSocialUserResponse> {
    const [user] = await this.queries.queryGetUser(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
