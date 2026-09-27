/** Normalized name of an aerobic activity. */
export class AerobicActivityType {
  public readonly value: string;

  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) throw new Error('Aerobic activity type is required');
    if (normalized.length > 50) throw new Error('Aerobic activity type must be at most 50 characters');
    this.value = normalized;
  }
}
