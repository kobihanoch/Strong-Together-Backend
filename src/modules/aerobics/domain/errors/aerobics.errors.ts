import { DomainValidationError } from '../../../../common/domain/errors/domain.errors';

export class AerobicActivityTypeRequiredError extends DomainValidationError {
  public constructor() {
    super('Aerobic activity type is required');
  }
}

export class AerobicActivityTypeTooLongError extends DomainValidationError {
  public constructor() {
    super('Aerobic activity type must be at most 50 characters');
  }
}

export class InvalidAerobicDurationMinutesError extends DomainValidationError {
  public constructor() {
    super('Aerobic duration minutes must be an integer between 0 and 10080');
  }
}

export class InvalidAerobicDurationSecondsError extends DomainValidationError {
  public constructor() {
    super('Aerobic duration seconds must be an integer between 0 and 59');
  }
}

export class AerobicDurationRequiredError extends DomainValidationError {
  public constructor() {
    super('Aerobic duration must be greater than zero');
  }
}
