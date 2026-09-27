/** Plaintext password validated before one-way hashing. */
export class RegistrationPassword {
  public readonly value: string;
  public constructor(value: string) {
    if (value.length < 8) throw new Error('Password must be at least 8 characters long');
    if (value.length > 128) throw new Error('Password must be at most 128 characters long');
    this.value = value;
  }
}
