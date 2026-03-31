export interface GoogleTokenVerificationResult {
  googleSub: string;
  email: string | null;
  emailVerified: boolean;
  fullName: string;
}

export interface AppleTokenVerificationResult {
  appleSub: string;
  email: string | null;
  emailVerified: boolean;
  fullName: string;
}
