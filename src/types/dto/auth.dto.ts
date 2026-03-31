import { UserEntity } from '../entities/user.entity.ts';

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
  id: UserEntity['id'];
  role: UserEntity['role'];
  is_verified: UserEntity['is_verified'];
}

export type UserByIndetifier = Pick<UserEntity, 'id' | 'name' | 'username' | 'password' | 'is_first_login' | 'role'> & {
  is_verified: UserEntity['is_verified'];
};

export interface UserAfterBump {
  token_version: UserEntity['token_version'];
  user_data: Omit<UserEntity, 'password' | 'token_version'>;
}

export interface TokenVersionResult {
  token_version: UserEntity['token_version'];
}
