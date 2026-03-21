export interface GoogleTokenVerificationResult {
  googleSub: string;
  email: string | null;
  emailVerified: boolean;
  fullName: string | null;
}

export interface AppleTokenVerificationResult {
  appleSub: string;
  email: string | null;
  emailVerified: boolean;
  fullName: string | null;
}
