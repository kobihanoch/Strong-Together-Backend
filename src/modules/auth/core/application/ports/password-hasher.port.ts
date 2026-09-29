/** Shared password hashing operations required by authentication use cases. */
export abstract class PasswordHasher {
  abstract compare(plaintext: string, hash: string): Promise<boolean>;
  abstract hash(plaintext: string): Promise<string>;
}
