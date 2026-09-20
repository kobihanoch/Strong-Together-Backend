/** Base error for expected password workflow failures. */
export abstract class PasswordError extends Error {
  abstract readonly statusCode: number;
}

export class PasswordBadRequestError extends PasswordError {
  readonly statusCode = 400;
}
