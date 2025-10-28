import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Returns:
 *  - { ok: true, id?: string } on success
 *  - { ok: false, permanent: true, reason: string } on permanent error (no throw)
 * Throws:
 *  - Error on transient error (so Bull will retry)
 */
export async function sendMail({ to, subject, html }) {
  // Basic input guard
  if (!to || !subject || !html) {
    return { ok: false, permanent: true, reason: "Missing required fields" };
  }

  try {
    const result = await resend.emails.send({
      from: "Strong Together <support@auth.kobihanoch.com>",
      to,
      subject,
      html,
      reply_to: "support@auth.kobihanoch.com",
    });

    // The Resend SDK returns { data, error } (not always throws)
    if (result?.error) {
      const err = result.error;
      const status = err?.statusCode ?? err?.response?.status ?? null;
      const msg = err?.message || "Resend error";

      if (isTransientStatus(status) || looksTransientMessage(msg)) {
        // Transient: throw → Bull will retry
        throw new Error(`Resend transient error (${status ?? "n/a"}): ${msg}`);
      }

      // Permanent: don't throw → job won't retry
      console.warn(`[sendMail] Permanent error for ${to}: ${msg}`);
      return { ok: false, permanent: true, reason: msg };
    }

    // Success path
    return { ok: true, id: result?.data?.id || null };
  } catch (e) {
    // Network/unknown errors here: treat as transient (retry)
    const status = e?.statusCode ?? e?.response?.status ?? null;
    const msg = e?.message || "Resend request failed";
    if (
      isTransientStatus(status) ||
      looksTransientMessage(msg) ||
      status === null
    ) {
      throw new Error(`Resend transient failure (${status ?? "n/a"}): ${msg}`);
    }
    // If we can clearly classify as permanent (rare in catch), return non-throw
    console.warn(`[sendMail] Non-throw permanent for ${to}: ${msg}`);
    return { ok: false, permanent: true, reason: msg };
  }
}

// ---- Helpers ----
function isTransientStatus(status) {
  if (status == null) return true; // no status (network/timeout) → transient
  if (status >= 500) return true; // server errors → transient
  if (status === 429) return true; // rate limit → transient
  return false; // 4xx (except 429) → permanent
}

function looksTransientMessage(msg = "") {
  const m = msg.toLowerCase();
  return (
    m.includes("timeout") ||
    m.includes("temporarily") ||
    (m.includes("rate") && m.includes("limit")) ||
    m.includes("unavailable")
  );
}
