import { ApplicationForbiddenError, ApplicationNotFoundError } from '../../../../../../common/application/errors/application.errors';

/** Raised when a crew is absent or inaccessible. */
export class CrewNotFoundError extends ApplicationNotFoundError {
  public constructor() {
    super('Crew not found');
  }
}
/** Raised when the caller cannot manage a crew's requests. */
export class CrewRequestAccessDeniedError extends ApplicationForbiddenError {
  public constructor() {
    super('Crew request access denied');
  }
}
/** Raised when a participation request cannot be resolved. */
export class ParticipationRequestNotFoundError extends ApplicationNotFoundError {
  public constructor() {
    super('Participation request not found');
  }
}
