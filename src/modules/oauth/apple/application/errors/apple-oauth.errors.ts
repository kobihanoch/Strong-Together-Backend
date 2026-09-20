/** Raised when Apple OAuth input or token claims are invalid. */
export class InvalidAppleOAuthError extends Error {
  readonly statusCode = 400;
}

/** Raised when the linked account cannot start an authenticated session. */
export class AppleOAuthUnauthorizedError extends Error {
  readonly statusCode = 401;
}
