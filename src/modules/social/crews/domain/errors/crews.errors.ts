import { DomainConflictError, DomainNotFoundError, DomainValidationError } from '../../../../../common/domain/errors/domain.errors';

export class CrewNameRequiredError extends DomainValidationError {
  public constructor() {
    super('Crew name is required');
  }
}

export class CrewNameTooLongError extends DomainValidationError {
  public constructor() {
    super('Crew name must be at most 100 characters');
  }
}

export class InvalidCrewPrivacyError extends DomainValidationError {
  public constructor() {
    super('Crew privacy must be public or private');
  }
}

export class ActiveCrewMembershipMissingError extends DomainNotFoundError {
  public constructor() {
    super('Active crew membership not found');
  }
}

export class InactiveCrewParticipantError extends DomainConflictError {
  public constructor() {
    super('Crew participant must be active');
  }
}
