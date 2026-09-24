import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { PostNotFoundError } from '../errors/posts.errors';
import { PostsRepository } from '../ports/posts.repository';

/** Updates a post owned by the caller. */

@Injectable()
export class UpdatePostUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: PostsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param id - Post identifier.
   * @param content - Replacement text.
   * @returns Nothing after update.
   * @throws {PostNotFoundError} When inaccessible or absent.
   */
  public async execute(userId: string, id: string, content: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      const outcome = await this.repository.update(id, content);
      if (outcome.kind === 'not-found') throw new PostNotFoundError();
    });
  }
}
