import { Injectable, NotFoundException } from '@nestjs/common';
import type { AddCommentBody, EditCommentBody, ListPostCommentsResponse } from '@strong-together/shared';
import { decodeSocialCursor, encodeSocialCursor } from '../../cursor-pagination';
import { CommentsQueries } from './comments.queries';

/** Coordinates comment writes and converts empty query results into HTTP errors. */
@Injectable()
export class CommentsService {
  /**
   * Creates the comment service.
   *
   * @param queries - The RLS-aware comment query repository.
   */
  public constructor(private readonly queries: CommentsQueries) {}

  /**
   * Lists one cursor-paginated page of comments on a visible post.
   *
   * @param postId - The post UUID.
   * @param limit - The requested page size.
   * @param cursor - The opaque cursor returned by the preceding page.
   * @returns Comments and a continuation cursor when another page exists.
   */
  public async listPostComments(postId: string, limit: number, cursor?: string): Promise<ListPostCommentsResponse> {
    const rows = await this.queries.queryPostComments(postId, limit, decodeSocialCursor(cursor));
    const comments = rows.slice(0, limit);
    const last = comments.at(-1);

    return {
      comments,
      nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.id }) : null,
    };
  }

  /**
   * Adds an authored comment to a visible post.
   *
   * @param postId - The post UUID.
   * @param userId - The authenticated author's UUID.
   * @param body - The validated comment content.
   * @returns A promise that resolves after creation.
   * @throws NotFoundException when the post is unavailable.
   */
  public async addComment(postId: string, userId: string, body: AddCommentBody): Promise<void> {
    if (!(await this.queries.queryAddComment(postId, userId, body.content)).length) throw new NotFoundException('Post not found');
  }

  /**
   * Edits a comment owned by the caller.
   *
   * @param id - The comment UUID.
   * @param body - The validated replacement content.
   * @returns A promise that resolves after the update.
   * @throws NotFoundException when the comment is unavailable.
   */
  public async editComment(id: string, body: EditCommentBody): Promise<void> {
    if (!(await this.queries.queryEditComment(id, body.content)).length) throw new NotFoundException('Comment not found');
  }

  /**
   * Deletes a comment owned by the caller.
   *
   * @param id - The comment UUID.
   * @returns A promise that resolves after deletion.
   * @throws NotFoundException when the comment is unavailable.
   */
  public async deleteComment(id: string): Promise<void> {
    if (!(await this.queries.queryDeleteComment(id)).length) throw new NotFoundException('Comment not found');
  }
}
