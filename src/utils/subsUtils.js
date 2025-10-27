// utils/verifyAppleReceipt.js
import fetch from "node-fetch";

const APPLE_VERIFY_PROD = "https://buy.itunes.apple.com/verifyReceipt";
const APPLE_VERIFY_SANDBOX = "https://sandbox.itunes.apple.com/verifyReceipt";

const SHARED_SECRET = process.env.APPLE_SHARED_SECRET;

export async function verifyAppleReceipt({ receiptBase64, productId }) {
  // Calls Apple's verifyReceipt. Tries production first; if status=21007, retries sandbox.
  const call = async (endpoint) => {
    const body = {
      "receipt-data": receiptBase64,
      password: SHARED_SECRET,
      "exclude-old-transactions": true,
    };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Apple verify HTTP ${res.status}`);
    return res.json();
  };

  let data = await call(APPLE_VERIFY_PROD);
  if (data?.status === 21007) {
    data = await call(APPLE_VERIFY_SANDBOX);
  }
  if (data?.status !== 0) {
    const code = data?.status ?? "unknown";
    throw new Error(`Invalid Apple receipt (status ${code})`);
  }

  // latest_receipt_info may include multiple items; pick the latest for the requested productId
  const items = Array.isArray(data?.latest_receipt_info)
    ? data.latest_receipt_info
    : [];
  const latestForProduct = items
    .filter((x) => x.product_id === productId)
    .sort((a, b) => Number(b.expires_date_ms) - Number(a.expires_date_ms))[0];

  if (!latestForProduct) {
    throw new Error("No matching subscription item found for productId");
  }

  // Find auto_renew_status in pending_renewal_info by matching original_transaction_id
  const originalTxId = latestForProduct.original_transaction_id;
  const pending = (data.pending_renewal_info || []).find(
    (p) => p.original_transaction_id === originalTxId
  );
  const willRenew = pending?.auto_renew_status === "1";

  return {
    productId: latestForProduct.product_id,
    originalTransactionId: originalTxId,
    purchaseDateMs: Number(latestForProduct.purchase_date_ms),
    expiresDateMs: Number(latestForProduct.expires_date_ms),
    willRenew,
    raw: data, // optional for debugging
  };
}
