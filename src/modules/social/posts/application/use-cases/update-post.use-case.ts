import { Injectable } from '@nestjs/common';
import { PostNotFoundError } from '../errors/posts.errors';
import { PostsRepository } from '../ports/posts.repository';

/** Updates a post owned by the caller. */ @Injectable()
export class UpdatePostUseCase {
  public constructor(private readonly repository: PostsRepository) {}
  /**
   * Executes the application operation.
   *
   *
   * @param id - Post identifier.
   * @param content - Replacement text.
   * @returns Nothing after update.
   * @throws {PostNotFoundError} When inaccessible or absent.
   */
  public async execute(id: string, content: string): Promise<void> {
    if (!(await this.repository.update(id, content))) throw new PostNotFoundError();
  }
}
