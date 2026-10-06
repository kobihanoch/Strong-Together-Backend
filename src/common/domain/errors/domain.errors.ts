/** Base type for expected, transport-neutral domain failures. */
export abstract class DomainError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** A domain value or operation is invalid. */
export abstract class DomainValidationError extends DomainError {}

/** A domain concept required by a behavior is absent. */
export abstract class DomainNotFoundError extends DomainError {}

/** Current domain state prevents the requested transition. */
export abstract class DomainConflictError extends DomainError {}
