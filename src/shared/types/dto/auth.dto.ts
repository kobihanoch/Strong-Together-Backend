import type { UserEntity } from '../entities/user.entity.ts';

export interface AuthenticatedUser {
  id: string;
  role: string;
  is_verified: boolean;
}

export type UserByIndetifier = Pick<
  UserEntity,
  'id' | 'name' | 'username' | 'password' | 'is_first_login' | 'role' | 'is_verified'
>;
