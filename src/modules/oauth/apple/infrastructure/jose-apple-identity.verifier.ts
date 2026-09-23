import type { JWTPayload } from 'jose';
import * as jose from 'jose';
import { Injectable } from '@nestjs/common';
import { authConfig } from '../../../../config/auth.config';
import type { AppleIdentityName, VerifyAppleIdentityOutcome } from '../application/models/apple-oauth.models';
import { AppleIdentityVerifier } from '../application/ports/apple-identity-verifier.port';
import { buildOAuthDisplayName } from '../../core/domain/oauth-display-name';

/** Describes the apple jwt payload shape. */
interface AppleJwtPayload extends JWTPayload {
  email?: string | null;
  email_verified?: boolean | 'true' | 'false';
  nonce?: string;
}

const APPLE_ISS = 'https://appleid.apple.com';
const APPLE_JWKS_URL = 'https://appleid.apple.com/auth/keys';
const jwks = jose.createRemoteJWKSet(new URL(APPLE_JWKS_URL));
const ALLOWED_AUDS = authConfig.appleAllowedAuds;

/** JOSE-backed Apple identity-token verifier. */
@Injectable()
export class JoseAppleIdentityVerifier implements AppleIdentityVerifier {
  async verify(identityToken: string, rawNonce: string, name?: AppleIdentityName): Promise<VerifyAppleIdentityOutcome> {
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
      return { kind: 'invalid-nonce' };
    }

    // 3) Extract identity fields
    const appleSub = payload.sub as string;
    const email = payload.email ?? null;
    const emailVerified = payload.email_verified === 'true' || payload.email_verified === true;

    const fullName = buildOAuthDisplayName(name?.givenName, name?.familyName);

    return { kind: 'verified', identity: { appleSub, email, emailVerified, fullName } };
  }
}
