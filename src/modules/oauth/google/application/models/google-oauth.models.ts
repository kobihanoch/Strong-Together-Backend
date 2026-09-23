/** Input required for Google OAuth authentication. */
export interface GoogleOAuthInput {
  idToken?: string | undefined;
}

/** Verified identity extracted from a Google identity token. */
export interface VerifiedGoogleIdentity {
  googleSub: string;
  email: string | null;
  emailVerified: boolean;
  fullName: string;
}

/** Result of validating a Google identity token. */
export type VerifyGoogleIdentityOutcome = { kind: 'verified'; identity: VerifiedGoogleIdentity } | { kind: 'invalid-audience' };
