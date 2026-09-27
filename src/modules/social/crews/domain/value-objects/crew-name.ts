/** Normalized display name for a social crew. */
export class CrewName {
  public readonly value: string;

  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) throw new Error('Crew name is required');
    if (normalized.length > 100) throw new Error('Crew name must be at most 100 characters');
    this.value = normalized;
  }
}
