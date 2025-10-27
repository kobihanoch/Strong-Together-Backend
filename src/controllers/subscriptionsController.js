import createError from "http-errors";
import { queryUpdateSub } from "../queries/subscriptionsQueries";
import { verifyAppleReceipt } from "../utils/subsUtils";

// @desc    Pay for pro sub and apply DB
// @route   POST /api/subs/prosub
// @access  Private
export const applyProSubAndPayment = async (req, res) => {
  // Expect authenticated user
  const userId = req.user.id;

  // Client payload should include productId and transactionReceipt (base64)
  const { productId, transactionReceipt } = req.body || {};
  if (!productId || !transactionReceipt) {
    throw createError(400, "productId and transactionReceipt are required");
  }

  // 1) Verify against Apple
  const v = await verifyAppleReceipt({
    receiptBase64: transactionReceipt,
    productId,
  });

  // 2) Derive status from now/expires/willRenew
  const nowMs = Date.now();
  const status =
    nowMs < v.expiresDateMs
      ? v.willRenew
        ? "active"
        : "cancelled"
      : "expired";

  // 3) Upsert subscription row
  await queryUpdateSub(
    userId,
    transactionReceipt,
    new Date(v.purchaseDateMs), // started_at
    new Date(v.expiresDateMs), // expires_at
    v.willRenew,
    v.originalTransactionId,
    status,
    v.productId
  );

  // 4) Respond with entitlement summary
  const hasPremium = nowMs < v.expiresDateMs && status !== "expired";

  return res.json({
    ok: true,
    productId: v.productId,
    status,
    willRenew: v.willRenew,
    expiresAt: new Date(v.expiresDateMs).toISOString(),
    hasPremium,
  });
};
