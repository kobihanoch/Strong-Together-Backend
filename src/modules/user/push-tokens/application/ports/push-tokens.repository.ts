/** Persists push-notification tokens for users. */
export abstract class PushTokensRepository {
  abstract replace(userId: string, token: string): Promise<void>;
}
