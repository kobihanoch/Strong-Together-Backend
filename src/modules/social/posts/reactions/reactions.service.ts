import { Injectable, NotFoundException } from '@nestjs/common';
import type { ListPostReactionsResponse, ReactToPostBody } from '@strong-together/shared';
import { decodeSocialCursor, encodeSocialCursor } from '../../cursor-pagination';
import { ReactionsQueries } from './reactions.queries';

/** Coordinates reaction writes and converts empty query results into HTTP errors. */
@Injectable()
export class ReactionsService {
  /**
   * Creates the reaction service.
   *
   * @param queries - The RLS-aware reaction query repository.
   */
  public constructor(private readonly queries: ReactionsQueries) {}

  /**
   * Lists one cursor-paginated page of reactions on a visible post.
   *
   * @param postId - The post UUID.
   * @param limit - The requested page size.
   * @param cursor - The opaque cursor returned by the preceding page.
   * @returns Reactions and a continuation cursor when another page exists.
   */
  public async listPostReactions(postId: string, limit: number, cursor?: string): Promise<ListPostReactionsResponse> {
    const rows = await this.queries.queryPostReactions(postId, limit, decodeSocialCursor(cursor));
    const reactions = rows.slice(0, limit);
    const last = reactions.at(-1);

    return {
      reactions,
      nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.reactedAt, id: last.id }) : null,
    };
  }

  /**
   * Creates or replaces the caller's reaction to a post.
   *
   * @param postId - The post UUID.
   * @param userId - The authenticated user's UUID.
   * @param body - The validated reaction type.
   * @returns A promise that resolves after the reaction is saved.
   * @throws NotFoundException when the post is unavailable.
   */
  public async react(postId: string, userId: string, body: ReactToPostBody): Promise<void> {
    if (!(await this.queries.queryReact(postId, userId, body.type)).length) throw new NotFoundException('Post not found');
  }

  /**
   * Deletes the caller's reaction from a post.
   *
   * @param postId - The post UUID.
   * @param userId - The authenticated user's UUID.
   * @returns A promise that resolves after deletion.
   * @throws NotFoundException when the reaction does not exist.
   */
  public async deleteReaction(postId: string, userId: string): Promise<void> {
    if (!(await this.queries.queryDeleteReaction(postId, userId)).length) throw new NotFoundException('Reaction not found');
  }
}
