/** Normalized email address used by account verification workflows. */
export class VerificationEmail {
  public readonly value: string;
  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('Invalid email');
    this.value = normalized;
  }
}
