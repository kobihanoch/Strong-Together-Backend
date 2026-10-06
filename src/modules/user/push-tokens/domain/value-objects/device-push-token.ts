/** Normalized device token used for push notifications. */
export class DevicePushToken {
  public readonly value: string;
  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) throw new Error('Push token is required');
    if (normalized.length > 4_096) throw new Error('Push token must be at most 4096 characters');
    this.value = normalized;
  }
}
