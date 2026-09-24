import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { CrewTargetRequiredError } from '../errors/posts.errors';
import type { CreatePostInput } from '../models/posts.models';
import { PostsRepository } from '../ports/posts.repository';

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
      if (input.visibility === 'crews_only' && input.crewIds.length === 0) throw new CrewTargetRequiredError();
      await this.repository.create(userId, input);
    });
  }
}
