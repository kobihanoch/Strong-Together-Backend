import axios from "axios";
import createError from "http-errors";

// Returns { ok: true, id? } OR { ok: false, permanent: true, reason }
export async function sendPushNotification(token, title, body) {
  if (!token || typeof token !== "string" || token.length < 10)
    return { ok: false, permanent: true, reason: "Invalid token" };

  const message = { to: token, sound: "default", title, body };

  const res = await axios.post(
    "https://exp.host/--/api/v2/push/send",
    message,
    {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      timeout: 8000,
      validateStatus: () => true,
    }
  );

  // HTTP transport-level
  if (res.status >= 500 || res.status === 429) {
    throw createError(503, `Expo HTTP transient ${res.status}`);
  }
  if (res.status >= 400) {
    return { ok: false, permanent: true, reason: `Expo HTTP ${res.status}` };
  }

  // Body-level (ticket)
  const ticket = res?.data?.data ?? res?.data;
  const status = ticket?.status;
  if (status === "ok") return { ok: true, id: ticket?.id || null };

  const code = ticket?.details?.error || ticket?.error || "unknown";
  const reason = ticket?.message || code;

  if (isExpoTransientCode(code)) {
    throw createError(503, `Expo transient: ${code} - ${reason}`);
  }

  if (code === "DeviceNotRegistered") {
    // Optionally disable token in DB here
    // await markTokenDisabled(token, "DeviceNotRegistered");
  }
  return { ok: false, permanent: true, reason: `${code}: ${reason}` };
}

function isExpoTransientCode(code = "") {
  const c = String(code).toLowerCase();
  return (
    c.includes("rate") || // MessageRateExceeded / ExpoRateLimitExceeded
    c.includes("unavailable") || // ServiceUnavailable
    c.includes("timeout") ||
    c.includes("internal") ||
    c.includes("server")
  );
}
