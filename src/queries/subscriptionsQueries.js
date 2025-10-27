import sql from "../config/db";

export const queryUpdateSub = async (
  userId,
  receipt,
  periodStart,
  periodExpire,
  willRenew,
  transactionId,
  status,
  productId
) => {
  // This UPSERT ensures there is only one row per user.
  // If the user already has a subscription row, we update it with the latest cycle info.
  await sql`
    insert into public.users_subs (
      user_id,
      started_at,
      subscription_receipt,
      will_renew,
      expires_at,
      external_transaction_id,
      status,
      product_id
    )
    values (
      ${userId},
      ${periodStart},
      ${receipt},
      ${willRenew},
      ${periodExpire},
      ${transactionId},
      ${status},
      ${productId}
    )
    on conflict (user_id)
    do update set
      started_at = excluded.started_at,
      subscription_receipt = excluded.subscription_receipt,
      will_renew = excluded.will_renew,
      expires_at = excluded.expires_at,
      external_transaction_id = excluded.external_transaction_id,
      status = excluded.status,
      product_id = excluded.product_id
  `;
};
