import { ApplicationNotFoundError, ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

/** Raised when a crew is absent or inaccessible to the caller. */
export class CrewNotFoundError extends ApplicationNotFoundError {
  public constructor() {
    super('Crew not found');
  }
}

/** Raised when the caller has no active membership to leave. */
export class ActiveCrewMembershipNotFoundError extends ApplicationNotFoundError {
  public constructor() {
    super('Active crew membership not found');
  }
}

/** Raised when a crew has no removable profile picture. */
export class CrewProfilePictureNotFoundError extends ApplicationNotFoundError {
  public constructor() {
    super('Crew profile picture not found');
  }
}

/** Raised when no image was supplied for a profile-picture replacement. */
export class CrewImageRequiredError extends ApplicationValidationError {
  public constructor() {
    super('No file provided');
  }
}
