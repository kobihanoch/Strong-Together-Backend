export interface UserEntity {
  id: string;
  username: string;
  email: string | null;
  name: string;
  gender: string;
  created_at: string;
  profile_image_url: string | null;
  push_token: string | null;
  password: string | null;
  role: string;
  is_first_login: boolean;
  token_version: number;
  is_verified: boolean;
  auth_provider: string;
}
