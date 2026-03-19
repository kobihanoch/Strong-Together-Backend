export interface ChangeEmailTokenPayload {
  jti: string;
  sub: string;
  newEmail: string;
  exp: number;
  iss: string;
  typ: string;
}
