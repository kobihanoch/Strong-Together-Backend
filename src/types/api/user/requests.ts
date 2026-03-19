import type { UserEntity } from "../../entities/user.entity.ts";

export type CreateUserRequest = Omit<
  UserEntity,
  "id" | "created_at" | "token_version" | "is_verified" | "role" | "password"
> & {
  fullName: string;
  password: string;
};

export interface UpdateUserBody {
  username?: string | null;
  fullName?: string | null;
  email?: string | null;
  gender?: string | null;
  password?: string | null;
  profileImgUrl?: string | null;
  pushToken?: string | null;
  setCompletedOnOAuth?: boolean;
}

export interface SaveUserPushTokenRequest {
  token: string;
}

export interface DeleteUserProfilePicRequest {
  path: string;
}
