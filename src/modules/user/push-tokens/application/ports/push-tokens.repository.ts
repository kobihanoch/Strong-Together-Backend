import type { DevicePushToken } from '../../domain/value-objects/device-push-token';

/** Persists push-notification tokens for users. */
export abstract class PushTokensRepository {
  abstract replace(token: DevicePushToken): Promise<void>;
}
