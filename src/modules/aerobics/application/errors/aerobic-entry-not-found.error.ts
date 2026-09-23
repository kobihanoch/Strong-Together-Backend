import { ApplicationNotFoundError } from '../../../../common/application/errors/application.errors';

/** Application error raised when an owned aerobic entry cannot be found for mutation. */
export class AerobicEntryNotFoundError extends ApplicationNotFoundError {
  constructor() {
    super('Aerobic entry not found');
  }
}
