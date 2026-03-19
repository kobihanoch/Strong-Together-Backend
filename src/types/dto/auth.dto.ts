export interface AccessTokenPayload {
  id: string;
  tokenVer: number;
  cnf?: {
    jkt: string;
  };
}

export interface AuthenticatedUser {
  id: string;
  role: string;
  is_verified: boolean;
}
