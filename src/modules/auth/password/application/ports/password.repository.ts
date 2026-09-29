/** Password persistence required by the password-reset use cases. */
export abstract class PasswordRepository {
  abstract save(userId: string, passwordHash: string): Promise<void>;
}
