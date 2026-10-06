/** Shared authentication control of the request transaction identity. */
export abstract class AuthenticationTransaction {
  abstract promoteToUser(userId: string): Promise<void>;
}
