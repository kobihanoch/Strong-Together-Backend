import { UserEntity } from "./db/entities.ts";

// Basic Data Structures
export interface UserDataResponse {
  user_data: Omit<UserEntity, "password">;
}

export interface ChangeEmailTokenPayload {
  jti: string;
  sub: string;
  newEmail: string;
  exp: number;
  iss: string;
  typ: string;
}

// Handler Types
// CreateUser
export type CreateUserRequest = Omit<
  UserEntity,
  "id" | "created_at" | "token_version" | "is_verified" | "role" | "password"
> & {
  fullName: string;
  password: string;
};
export interface CreateUserResponse {
  message: string;
  user: UserEntity;
}

// GetAuthenticatedUserById
export type GetAuthenticatedUserByIdResponse = UserDataResponse["user_data"];

// UpdateAuthenticatedUser
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
export interface UpdateAuthenticatedUserResponse {
  message: string;
  emailChanged: boolean;
  user: UserDataResponse["user_data"];
}

// SaveUserPushToken
export interface SaveUserPushTokenRequest {
  token: string;
}

// SetProfilePicAndUpdateDB
export interface SetProfilePicAndUpdateDBResponse {
  path: string;
  url: string;
  message: string;
}

// DeleteUserProfilePic
export interface DeleteUserProfilePicRequest {
  path: string;
}
