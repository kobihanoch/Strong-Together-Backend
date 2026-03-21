import type { UserEntity } from '../../entities/user.entity.ts';

export interface UserDataResponse {
  user_data: Omit<UserEntity, 'password'>;
}

export interface CreateUserResponse {
  message: string;
  user: Pick<UserEntity, 'id' | 'username' | 'name' | 'email' | 'gender' | 'role' | 'created_at'>;
}

export type GetAuthenticatedUserByIdResponse = UserDataResponse['user_data'];

export interface UpdateAuthenticatedUserResponse {
  message: string;
  emailChanged: boolean;
  user: UserDataResponse['user_data'];
}

export interface SetProfilePicAndUpdateDBResponse {
  path: string;
  url: string;
  message: string;
}
