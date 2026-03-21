export interface GoogleOAuthRequestBody {
  idToken?: string;
}

interface AppleNameInput {
  givenName?: string;
  familyName?: string;
}

export interface AppleOAuthRequestBody {
  idToken?: string;
  rawNonce?: string;
  name?: AppleNameInput;
  email?: string | null;
}
