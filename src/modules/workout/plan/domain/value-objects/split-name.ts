/** Validated display name for a workout split. */
export class SplitName {
  private constructor(public readonly value: string) {}

  /** Creates a trimmed split name within the supported length. */
  public static create(value: string): SplitName {
    const name = value.trim();
    if (name.length === 0) throw new InvalidSplitNameError();
    if (name.length > 100) throw new SplitNameTooLongError();
    return new SplitName(name);
  }
}
import { InvalidSplitNameError, SplitNameTooLongError } from '../errors/workout-plan.errors';
