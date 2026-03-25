export interface OauthAccountEntity {
  id: string;
  user_id: string;
  provider: string;
  provider_user_id: string;
  provider_email: string;
  linked_at: string;
  missing_fields: string | null;
}
