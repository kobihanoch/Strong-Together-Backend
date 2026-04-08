import type { JWTPayload } from 'jose';
import * as jose from 'jose';
import { authConfig } from '../../../config/auth.config.ts';
import type { AppleTokenVerificationResult } from '../../../shared/types/dto/oAuth.dto.ts';

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
