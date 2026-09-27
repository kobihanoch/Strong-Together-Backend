/** Username accepted for local account registration. */
export class RegistrationUsername {
  public readonly value: string;
  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length < 3) throw new Error('Username must be at least 3 characters');
    if (normalized.length > 15) throw new Error('Username must be at most 15 characters');
    if (!/^[a-zA-Z0-9_]+$/.test(normalized)) throw new Error('Username may contain letters, numbers, and underscore only');
    this.value = normalized;
  }
}
