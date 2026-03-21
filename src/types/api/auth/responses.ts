import { UserEntity } from '../../entities/user.entity.ts';

export interface LoginResponse {
  message: string;
  user: UserEntity['id'];
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export interface MessageResponse {
  message: string;
}

export interface ResetPasswordResponse {
  ok: boolean;
}
