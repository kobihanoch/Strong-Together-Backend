export interface UserSubscriptionEntity {
  id: string;
  user_id: string;
  started_at: string;
  subscription_receipt: string | null;
  will_renew: boolean | null;
  expires_at: string;
  external_transaction_id: string | null;
  status: string;
  product_id: string;
}
