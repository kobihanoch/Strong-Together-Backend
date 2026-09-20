/** OAuth providers supported by account persistence. */
export type OAuthProvider = 'apple' | 'google';

/** Session payload returned after a successful OAuth login. */
export interface OAuthLoginResult {
  message: string;
  user: string;
  accessToken: string;
  refreshToken: string;
}

/** Logging operations used while linking or creating OAuth accounts. */
export interface OAuthRequestLogger {
  info(data: object, message: string): void;
  error(data: object, message: string): void;
}
