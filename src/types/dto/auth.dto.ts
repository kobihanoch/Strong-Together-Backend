import { UserEntity } from "../entities/user.entity.ts";

export interface AccessTokenPayload {
  id: string;
  role: string;
  tokenVer: number;
  cnf?: {
    jkt: string;
  };
  iat?: number;
  exp?: number;
}

export interface EmailVerifyPayload {
  sub: string;
  jti: string;
  exp: number;
  iss: string;
  typ: string;
}

export interface ForgotPasswordPayload extends EmailVerifyPayload {}

export interface AuthenticatedUser {
  id: string;
  role: string;
  is_verified: boolean;
}

export type UserByIndetifier = Pick<
  UserEntity,
  | "id"
  | "name"
  | "username"
  | "password"
  | "is_first_login"
  | "role"
> & {
  is_verified?: boolean;
};

export interface UserAfterBump {
  token_version: number;
  user_data: Omit<UserEntity, "password" | "token_version">;
}

export interface TokenVersionResult {
  token_version: number;
}
