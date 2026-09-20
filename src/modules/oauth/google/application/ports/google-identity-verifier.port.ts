import type { VerifiedGoogleIdentity } from '../models/google-oauth.models';

/** Verifies Google identity tokens. */
export abstract class GoogleIdentityVerifier {
  abstract verify(idToken: string): Promise<VerifiedGoogleIdentity>;
}
