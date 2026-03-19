export interface OauthAccountEntity {
  id: string;
  user_id: string | null;
  provider: string | null;
  provider_user_id: string | null;
  provider_email: string | null;
  linked_at: string;
  missing_fields: string | null;
}
