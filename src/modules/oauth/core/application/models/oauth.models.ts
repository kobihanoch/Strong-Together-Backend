/** OAuth providers supported by account persistence. */
export type OAuthProvider = 'apple' | 'google';

/** Outcome of trying to attach an OAuth identity to an existing verified account. */
export type LinkOAuthAccountOutcome = { kind: 'linked'; userId: string } | { kind: 'no-match' };

/** Session payload returned after a successful OAuth login. */
export interface OAuthLoginResult {
  message: string;
  user: string;
  accessToken: string;
  refreshToken: string;
}
