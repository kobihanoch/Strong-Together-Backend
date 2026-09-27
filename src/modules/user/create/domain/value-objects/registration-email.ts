/** Normalized email address accepted for local registration. */
export class RegistrationEmail {
  public readonly value: string;
  public constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('Invalid email format');
    this.value = normalized;
  }
}
