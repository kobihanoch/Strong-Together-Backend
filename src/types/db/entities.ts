export interface UserEntity {
  id: string; // uuid
  username: string | null;
  email: string | null;
  name: string | null;
  gender: string | null;
  created_at: string; // timestamptz
  profile_image_url: string | null;
  push_token: string | null;
  password: string | null; // password_hash
  role: string;
  is_first_login: boolean;
  token_version: number;
  is_verified: boolean;
  auth_provider: string;
}
