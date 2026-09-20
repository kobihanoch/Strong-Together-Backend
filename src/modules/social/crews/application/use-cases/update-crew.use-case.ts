import { Injectable } from '@nestjs/common';
import { CrewNotFoundError } from '../errors/crews.errors';
import type { CrewInput } from '../models/crews.models';
import { CrewsRepository } from '../ports/crews.repository';

/** Updates a manageable crew. */
@Injectable()
export class UpdateCrewUseCase {
  public constructor(private readonly repository: CrewsRepository) {}
  /**
   * Executes the application operation.
   *
   *
   * @param id - Crew identifier.
   * @param input - Replacement properties.
   * @returns Nothing after update.
   * @throws {CrewNotFoundError} When inaccessible or absent. */
  public async execute(id: string, input: CrewInput): Promise<void> {
    if (!(await this.repository.update(id, input))) throw new CrewNotFoundError();
  }
}
