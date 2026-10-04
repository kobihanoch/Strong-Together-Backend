/** Publishes session lifecycle events required by other modules. */
export abstract class AuthenticationEvents {
  abstract userFirstLogin(userId: string, userName: string): Promise<void>;
}
