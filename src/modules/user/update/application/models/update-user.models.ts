/** User profile read projection. */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  profilePicPath: string | null;
  pushToken: string | null;
  role: string;
  isFirstLogin: boolean;
  tokenVersion: number;
  isVerified: boolean;
  authProvider: string;
  lastLogin: string | null;
}
/** Mutable user profile values. */
export interface UpdateUserInput {
  username?: string | undefined;
  fullName?: string | undefined;
  email?: string | undefined;
}
/** Uploaded binary profile-picture data. */
export interface ProfilePictureFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}
/** Result returned after replacing a profile picture. */
export interface ProfilePictureResult {
  profilePicPath: string;
  url: string;
  message: string;
}
/** Parsed email-change claims. */
export interface EmailChangeClaims {
  jti: string;
  sub: string;
  newEmail: string;
  exp: number;
  iss: string;
  typ: string;
}
/** Browser-facing outcome of an email confirmation attempt. */
export interface EmailChangeOutcome {
  statusCode: number;
  reason?: string;
}
