/** Base error for expected session workflow failures. */
export abstract class SessionError extends Error {
  abstract readonly statusCode: number;
}

export class SessionBadRequestError extends SessionError {
  readonly statusCode = 400;
}

export class SessionUnauthorizedError extends SessionError {
  readonly statusCode = 401;
}
