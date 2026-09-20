import { Injectable } from '@nestjs/common';
import { CommentNotFoundError } from '../errors/comments.errors';
import { CommentsRepository } from '../ports/comments.repository';

/** Edits a comment owned by the caller. */ @Injectable()
export class EditCommentUseCase {
  public constructor(private readonly repository: CommentsRepository) {}
  /**
   * Executes the application operation.
   *
   *
   * @param id - Comment identifier.
   * @param content - Replacement text.
   * @returns Nothing after update.
   * @throws {CommentNotFoundError} When inaccessible or absent.
   */
  public async execute(id: string, content: string): Promise<void> {
    if (!(await this.repository.edit(id, content))) throw new CommentNotFoundError();
  }
}
