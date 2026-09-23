/** User data required to validate credentials. */
export interface LoginUser {
  id: string;
  name: string | null;
  username: string;
  email?: string;
  passwordHash: string | null;
  role: string;
  isVerified: boolean;
  lastLogin?: string | null;
}

/** Authenticated user projection returned while rotating token state. */
export interface SessionUserData {
  id: string;
  username: string;
  email: string;
  name: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  profilePicPath: string | null;
  pushToken: string | null;
  role: string;
  isFirstLogin: boolean;
  tokenVersion: number;
  isVerified: boolean;
  authProvider: string;
  lastLogin: string | null;
}

/** Session data returned after atomically incrementing token version. */
export interface RotatedSession {
  tokenVersion: number;
  userData: SessionUserData;
}

/** Claims accepted from a refresh token. */
export interface RefreshTokenPayload {
  id: string;
  sub: string;
  role: string;
  tokenVer: number;
  typ: 'refresh';
  iss: 'strong-together';
  aud: 'strong-together-refresh';
  cnf?: { jkt: string } | undefined;
  iat: number;
  exp: number;
}

/** Claims accepted from an email-verification or password-reset token. */
export interface OneTimeAuthTokenPayload {
  sub: string;
  jti: string;
  exp: number;
  iss: string;
  typ: string;
}

/** Tokens issued for an authenticated session. */
export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
}

/** Public login result returned by the login use case. */
export interface LoginResult extends IssuedTokens {
  message: string;
  user: string;
}

/** Public refresh result returned by the refresh use case. */
export interface RefreshSessionResult extends IssuedTokens {
  message: string;
  userId: string;
}

/** User data required to address an authentication email. */
export interface AuthEmailRecipient {
  id: string;
  email: string;
  name: string | null;
  username: string;
}

/** Context propagated to an authentication email job. */
export interface AuthEmailContext {
  requestId?: string;
}

/** Result of rendering the email-verification browser page. */
export type EmailVerificationOutcome = 'verified' | 'invalid' | 'unauthorized';
