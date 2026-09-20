import type { AppleIdentityName, VerifiedAppleIdentity } from '../models/apple-oauth.models';

/** Verifies Apple identity tokens and nonce binding. */
export abstract class AppleIdentityVerifier {
  abstract verify(identityToken: string, rawNonce: string, name?: AppleIdentityName): Promise<VerifiedAppleIdentity>;
}
