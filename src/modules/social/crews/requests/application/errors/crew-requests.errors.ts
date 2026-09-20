/** Raised when a crew is absent or inaccessible. */
export class CrewNotFoundError extends Error {
  public readonly statusCode = 404;
  public constructor() {
    super('Crew not found');
    this.name = CrewNotFoundError.name;
  }
}
/** Raised when the caller cannot manage a crew's requests. */
export class CrewRequestAccessDeniedError extends Error {
  public readonly statusCode = 403;
  public constructor() {
    super('Crew request access denied');
    this.name = CrewRequestAccessDeniedError.name;
  }
}
/** Raised when a participation request cannot be resolved. */
export class ParticipationRequestNotFoundError extends Error {
  public readonly statusCode = 404;
  public constructor() {
    super('Participation request not found');
    this.name = ParticipationRequestNotFoundError.name;
  }
}
