import type { IssuedTokens, OneTimeAuthTokenPayload, RefreshTokenPayload } from '../models/auth.models';

/** Shared token operations required by authentication use cases. */
export abstract class AuthTokens {
  abstract issueSession(userId: string, role: string, tokenVersion: number, jkt?: string): IssuedTokens;
  abstract decodeRefresh(token: string, ignoreExpiration?: boolean): RefreshTokenPayload | null;
  abstract decodeVerification(token: string): OneTimeAuthTokenPayload | null;
  abstract decodePasswordReset(token: string): OneTimeAuthTokenPayload | null;
}
