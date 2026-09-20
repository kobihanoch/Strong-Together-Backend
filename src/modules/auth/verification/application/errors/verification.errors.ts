/** Base error for expected account-verification workflow failures. */
export abstract class VerificationError extends Error {
  abstract readonly statusCode: number;
}

export class VerificationBadRequestError extends VerificationError {
  readonly statusCode = 400;
}

export class VerificationUnauthorizedError extends VerificationError {
  readonly statusCode = 401;
}

export class VerificationConflictError extends VerificationError {
  readonly statusCode = 409;
}
