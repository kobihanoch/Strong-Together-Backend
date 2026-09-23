import { Injectable } from '@nestjs/common';
import { CrewNotFoundError } from '../errors/crews.errors';
import { CrewsRepository } from '../ports/crews.repository';

/** Deletes a manageable crew. */
@Injectable()
export class DeleteCrewUseCase {
  public constructor(private readonly repository: CrewsRepository) {}
  /**
   * Executes the application operation.
   *
   *
   * @param id - Crew identifier.
   * @returns Nothing after deletion.
   * @throws {CrewNotFoundError} When inaccessible or absent. */
  public async execute(id: string): Promise<void> {
    const outcome = await this.repository.delete(id);
    if (outcome.kind === 'not-found') throw new CrewNotFoundError();
  }
}
