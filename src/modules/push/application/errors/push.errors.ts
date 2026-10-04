import { ApplicationServiceUnavailableError } from '../../../../common/application/errors/application.errors';

/** Raised when push delivery failed for a transient, retryable reason. */
export class PushDeliveryTemporarilyUnavailableError extends ApplicationServiceUnavailableError {
  public constructor(reason: string) {
    super(`Push delivery is temporarily unavailable: ${reason}`);
  }
}
