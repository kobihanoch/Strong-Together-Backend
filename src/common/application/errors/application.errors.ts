/** Base type for expected, transport-neutral application failures. */
export abstract class ApplicationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export abstract class ApplicationNotFoundError extends ApplicationError {}

export abstract class ApplicationValidationError extends ApplicationError {}

export abstract class ApplicationConflictError extends ApplicationError {}

export abstract class ApplicationUnauthorizedError extends ApplicationError {}

export abstract class ApplicationForbiddenError extends ApplicationError {}
