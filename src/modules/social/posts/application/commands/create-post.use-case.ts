import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import type { CreatePostInput } from '../models/posts.models';
import { PostsRepository } from '../ports/posts.repository';
import { Post } from '../../domain/entities/post';

/** Creates a social post. */

@Injectable()
export class CreatePostUseCase {
  public constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: PostsRepository,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param userId - Author identifier.
   * @param input - Post content and visibility.
   * @returns Nothing after creation.
   * @throws {CrewTargetRequiredError} When a crew-only post has no crews.
   */
  public async execute(userId: string, input: CreatePostInput): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.create(Post.create(userId, input));
    });
  }
}
