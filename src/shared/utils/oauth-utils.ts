import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';
import type postgres from 'postgres';
import createError from 'http-errors';
import * as jose from 'jose';
import { authConfig } from '../../config/auth.config.ts';
import type { AppleTokenVerificationResult, GoogleTokenVerificationResult } from '../types/dto/oAuth.dto.ts';

interface GoogleJwtPayload extends JWTPayload {
  email?: string | null;
  email_verified?: boolean;
  name?: string | null;
  picture?: string | null;
}

interface AppleJwtPayload extends JWTPayload {
  email?: string | null;
  email_verified?: boolean | 'true' | 'false';
  nonce?: string;
}

interface AppleIdentityName {
  givenName?: string | null | undefined;
  familyName?: string | null | undefined;
}

interface VerifyAppleIdTokenParams {
  identityToken: string;
  rawNonce: string;
  name?: AppleIdentityName | null | undefined;
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

const APPLE_ISS = 'https://appleid.apple.com';
const APPLE_JWKS_URL = 'https://appleid.apple.com/auth/keys';
const jwks = jose.createRemoteJWKSet(new URL(APPLE_JWKS_URL));
const ALLOWED_AUDS = authConfig.appleAllowedAuds;

export async function verifyAppleIdToken({
  identityToken,
  rawNonce,
  name,
}: VerifyAppleIdTokenParams): Promise<AppleTokenVerificationResult & { payload: AppleJwtPayload }> {
  if (typeof identityToken !== 'string') throw new Error('Missing identityToken');

  // 1) Verify token signature and claims
  const { payload } = await jose.jwtVerify<AppleJwtPayload>(identityToken, jwks, {
    issuer: APPLE_ISS,
    audience: ALLOWED_AUDS,
  });

  // 2) Verify nonce integrity
  const enc = new TextEncoder();
  const dig = await crypto.subtle.digest('SHA-256', enc.encode(rawNonce));
  const nonceHashHex = Array.from(new Uint8Array(dig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if ((payload.nonce ?? '').toLowerCase() !== nonceHashHex.toLowerCase()) {
    throw new Error('Invalid nonce');
  }

  // 3) Extract identity fields
  const appleSub = payload.sub as string;
  const email = payload.email ?? null;
  const emailVerified = payload.email_verified === 'true' || payload.email_verified === true;

  const fullName = name?.givenName + ' ' + name?.familyName || 'New User';

  return { appleSub, email, emailVerified, fullName, payload };
}

export async function ensureUniqueUsername(trx: postgres.TransactionSql, candidate: string | null): Promise<string> {
  // If no candidate (no email or full name) => random fallback
  if (!candidate) return `user_${Math.random().toString(36).slice(2, 8)}`;

  // Start with the base name (e.g., "kobi")
  let username = candidate.toLowerCase();
  let i = 0;

  // Keep checking until we find a username that does not exist
  while (true) {
    const exists = await trx`SELECT 1 FROM users WHERE username = ${username} LIMIT 1`;

    if (exists.length === 0) {
      // Found a free username
      return username;
    }

    // Append a number (e.g., kobi1, kobi2, ...)
    i += 1;
    username = `${candidate}${i}`;
  }
}

export function isEnglishName(name: string | null | undefined): boolean {
  if (!name) return false;
  // Allow only English letters, spaces, hyphens, and apostrophes
  const englishRegex = /^[A-Za-z\s'-]+$/;
  return englishRegex.test(name.trim());
}
