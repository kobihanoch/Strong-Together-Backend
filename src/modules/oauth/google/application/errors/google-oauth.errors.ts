/** Raised when Google OAuth input or token claims are invalid. */
export class InvalidGoogleOAuthError extends Error {
  readonly statusCode = 400;
}

/** Raised when the linked account cannot start an authenticated session. */
export class GoogleOAuthUnauthorizedError extends Error {
  readonly statusCode = 401;
}
