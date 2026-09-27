/** Normalized email address used in profile changes. */
export class ProfileEmail {
  public readonly value: string;
  public constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('Invalid email format');
    this.value = normalized;
  }
}
