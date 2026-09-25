/** Validated display name for a workout split. */
export class SplitName {
  private constructor(public readonly value: string) {}

  /** Creates a trimmed split name within the supported length. */
  public static create(value: string): SplitName {
    const name = value.trim();
    if (name.length === 0) throw new Error('Split name is required');
    if (name.length > 100) throw new Error('Split name must be at most 100 characters');
    return new SplitName(name);
  }
}
