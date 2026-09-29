/** OAuth providers supported by account persistence. */
export type OAuthProvider = 'apple' | 'google';

/** Session payload returned after a successful OAuth login. */
export interface OAuthLoginResult {
  message: string;
  user: string;
  accessToken: string;
  refreshToken: string;
}
