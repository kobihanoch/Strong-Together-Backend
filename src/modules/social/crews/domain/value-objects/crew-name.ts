import { CrewNameRequiredError, CrewNameTooLongError } from '../errors/crews.errors';

/** Normalized display name for a social crew. */
export class CrewName {
  public readonly value: string;

  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) throw new CrewNameRequiredError();
    if (normalized.length > 100) throw new CrewNameTooLongError();
    this.value = normalized;
  }
}
