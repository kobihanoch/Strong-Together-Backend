/** Hashes registration passwords for persistence. */
export abstract class PasswordHasher {
  abstract hash(password: string): Promise<string>;
}
