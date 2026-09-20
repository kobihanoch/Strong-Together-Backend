/** Publishes lifecycle events owned by user registration. */
export abstract class UserRegistrationEvents {
  abstract userRegistered(userId: string, email: string, fullName: string, requestId?: string): Promise<void>;
}
