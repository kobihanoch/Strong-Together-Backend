import createError from 'http-errors';
import type { JWTPayload } from 'jose';
import * as jose from 'jose';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { GoogleTokenVerificationResult } from '../../../shared/types/dto/oAuth.dto.ts';

interface GoogleJwtPayload extends JWTPayload {
  email?: string | null;
  email_verified?: boolean;
  name?: string | null;
  picture?: string | null;
}

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

// Allow both dev and prod iOS client IDs as valid audiences
const GOOGLE_ALLOWED_AUDIENCES = new Set([
  '251052469921-m94nh37mk2tpeda5ft32p5k6sbll46ad.apps.googleusercontent.com', // dev iOS
  '251052469921-49q99ipshcsktkt3v6hemmrdjbec8oo8.apps.googleusercontent.com', // prod iOS
]);

export async function verifyGoogleIdToken(
  idToken: string,
): Promise<GoogleTokenVerificationResult & { picture: string | null; raw: GoogleJwtPayload }> {
  // Verify signature and standard claims
  const { payload } = await jwtVerify<GoogleJwtPayload>(idToken, GOOGLE_JWKS, {
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    // We check 'aud' manually since we allow two client IDs
    audience: undefined,
  } as unknown as jose.JWTVerifyOptions);

  // Strict audience check
  if (!payload.aud || !GOOGLE_ALLOWED_AUDIENCES.has(payload.aud as string)) {
    throw createError(400, 'Invalid audience for Google ID token');
  }

  // Extract useful fields
  return {
    googleSub: payload.sub as string,
    email: payload.email || null,
    emailVerified: payload.email_verified === true,
    fullName: payload.name || 'New User',
    picture: payload.picture || null,
    raw: payload,
  };
}
