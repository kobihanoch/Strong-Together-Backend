import { LoginResponse } from "../auth/responses.ts";

export interface OAuthLoginResponse extends Omit<
  LoginResponse,
  "refreshToken"
> {
  missingFields: string[] | null;
  refreshToken: string | null;
}

export interface ProceedLoginResponse extends LoginResponse {}
