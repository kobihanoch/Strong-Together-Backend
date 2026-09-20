/** Raised when a crew is absent or inaccessible to the caller. */
export class CrewNotFoundError extends Error {
  public readonly statusCode = 404;
  public constructor() {
    super('Crew not found');
    this.name = CrewNotFoundError.name;
  }
}

/** Raised when the caller has no active membership to leave. */
export class ActiveCrewMembershipNotFoundError extends Error {
  public readonly statusCode = 404;
  public constructor() {
    super('Active crew membership not found');
    this.name = ActiveCrewMembershipNotFoundError.name;
  }
}

/** Raised when a crew has no removable profile picture. */
export class CrewProfilePictureNotFoundError extends Error {
  public readonly statusCode = 404;
  public constructor() {
    super('Crew profile picture not found');
    this.name = CrewProfilePictureNotFoundError.name;
  }
}

/** Raised when no image was supplied for a profile-picture replacement. */
export class CrewImageRequiredError extends Error {
  public readonly statusCode = 400;
  public constructor() {
    super('No file provided');
    this.name = CrewImageRequiredError.name;
  }
}
