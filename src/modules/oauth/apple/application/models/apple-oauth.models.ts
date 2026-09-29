/** Apple name components supplied during first authorization. */
export interface AppleIdentityName {
  givenName?: string | null;
  familyName?: string | null;
}

/** Input required for Apple OAuth authentication. */
export interface AppleOAuthInput {
  idToken: string;
  rawNonce: string;
  name?: AppleIdentityName | undefined;
  email: string | null;
}

/** Verified identity extracted from an Apple identity token. */
export interface VerifiedAppleIdentity {
  appleSub: string;
  email: string | null;
  emailVerified: boolean;
  fullName: string;
}

/** Result of validating an Apple identity token and nonce. */
export type VerifyAppleIdentityOutcome = { kind: 'verified'; identity: VerifiedAppleIdentity } | { kind: 'invalid-nonce' };
