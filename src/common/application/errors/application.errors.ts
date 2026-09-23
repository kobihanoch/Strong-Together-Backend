/** Base type for expected, transport-neutral application failures. */
export abstract class ApplicationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Represents an expected failure caused by a missing resource. */
export abstract class ApplicationNotFoundError extends ApplicationError {}

/** Represents an expected failure caused by invalid application input. */
export abstract class ApplicationValidationError extends ApplicationError {}

/** Represents an expected failure caused by conflicting application state. */
export abstract class ApplicationConflictError extends ApplicationError {}

/** Represents an expected failure caused by missing or invalid authentication. */
export abstract class ApplicationUnauthorizedError extends ApplicationError {}

/** Represents an expected failure caused by insufficient authorization. */
export abstract class ApplicationForbiddenError extends ApplicationError {}
