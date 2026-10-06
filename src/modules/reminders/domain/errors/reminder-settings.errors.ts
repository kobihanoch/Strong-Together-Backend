import { DomainValidationError } from '../../../../common/domain/errors/domain.errors';

export class InvalidReminderEnabledError extends DomainValidationError {
  constructor() {
    super('Reminder enabled must be a boolean');
  }
}

export class InvalidReminderTimeZoneError extends DomainValidationError {
  constructor() {
    super('Time zone must be a valid IANA time zone');
  }
}
