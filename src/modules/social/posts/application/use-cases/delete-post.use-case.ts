import { Injectable } from '@nestjs/common';
import { PostNotFoundError } from '../errors/posts.errors';
import { PostsRepository } from '../ports/posts.repository';

/** Deletes a post owned by the caller. */ @Injectable()
export class DeletePostUseCase {
  public constructor(private readonly repository: PostsRepository) {}
  /**
   * Executes the application operation.
   *
   *
   * @param id - Post identifier.
   * @returns Nothing after deletion.
   * @throws {PostNotFoundError} When inaccessible or absent.
   */
  public async execute(id: string): Promise<void> {
    if (!(await this.repository.delete(id))) throw new PostNotFoundError();
  }
}
