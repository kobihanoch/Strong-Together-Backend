/**
 * Generates the HTML page for a successful account verification.
 * (Provided by user for reference)
 */
export const generateVerifiedHTML = () => {
  return `<!DOCTYPE html>
  <html lang="en"><head><meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Verified</title>
  <style>
    body { margin:0; background:#f6f8fc; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0b1220; }
    .wrap { max-width:560px; margin:10vh auto; background:#fff; border-radius:12px; padding:24px;
            box-shadow:0 10px 25px rgba(2,6,23,0.08); text-align:center; }
    .muted { color:#64748b; }
    .btn { display:inline-block; margin-top:16px; padding:12px 18px; border-radius:10px; background:#2979ff; color:#fff; font-weight:600; text-decoration:none; }
  </style>
  </head><body>
    <div class="wrap">
      <h1>You're verified 🎉</h1>
      <p class="muted">You can safely return to the app, and login.</p>
    </div>
  </body></html>`;
};

/**
 * Generates the HTML page for a failed account verification, typically due to an expired or invalid token.
 */
export const generateVerificationFailedHTML = () => {
  return `<!DOCTYPE html>
  <html lang="en"><head><meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Verification Failed</title>
  <style>
    body { margin:0; background:#f6f8fc; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0b1220; }
    .wrap { max-width:560px; margin:10vh auto; background:#fff; border-radius:12px; padding:24px;
            box-shadow:0 10px 25px rgba(2,6,23,0.08); text-align:center; }
    .muted { color:#64748b; }
    .error-icon { color: #ef4444; font-size: 3rem; margin-bottom: 8px; }
    .btn { display:inline-block; margin-top:16px; padding:12px 18px; border-radius:10px; background:#ef4444; color:#fff; font-weight:600; text-decoration:none; }
  </style>
  </head><body>
    <div class="wrap">
      <div class="error-icon">😔</div>
      <h1>Verification Failed</h1>
      <p class="muted">The verification link has expired or is invalid.</p>
      <p class="muted">Please return to the application and request a new verification email.</p>
    </div>
  </body></html>`;
};

/**
 * Generates an HTML page for successful email change.
 * The user is informed that the change will appear on the next app load.
 */
export const generateEmailChangeSuccessHTML = () => {
  return `<!DOCTYPE html>
  <html lang="en"><head><meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Email Updated</title>
  <style>
    body { margin:0; background:#f6f8fc; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0b1220; }
    .wrap { max-width:560px; margin:10vh auto; background:#fff; border-radius:12px; padding:24px;
            box-shadow:0 10px 25px rgba(2,6,23,0.08); text-align:center; }
    .muted { color:#64748b; }
    .success-icon { font-size:3rem; margin-bottom:8px; }
    .btn { display:inline-block; margin-top:16px; padding:12px 18px; border-radius:10px; background:#2979ff; color:#fff; font-weight:600; text-decoration:none; }
  </style>
  </head><body>
    <div class="wrap">
      <div class="success-icon">✅</div>
      <h1>Email Changed Successfully</h1>
      <p class="muted">Your email has been updated successfully.</p>
      <p class="muted">Changes will be visible the next time you open the app.</p>
    </div>
  </body></html>`;
};

/**
 * Generates an HTML page for failed email change attempts.
 * Accepts a reason string that will be injected into the page.
 */
export const generateEmailChangeFailedHTML = (
  reason = "Unknown error occurred"
) => {
  return `<!DOCTYPE html>
  <html lang="en"><head><meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Email Change Failed</title>
  <style>
    body { margin:0; background:#f6f8fc; font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0b1220; }
    .wrap { max-width:560px; margin:10vh auto; background:#fff; border-radius:12px; padding:24px;
            box-shadow:0 10px 25px rgba(2,6,23,0.08); text-align:center; }
    .muted { color:#64748b; }
    .error-icon { color:#ef4444; font-size:3rem; margin-bottom:8px; }
    .reason { color:#ef4444; margin-top:8px; font-weight:500; }
  </style>
  </head><body>
    <div class="wrap">
      <div class="error-icon">❌</div>
      <h1>Email Change Failed</h1>
      <p class="muted">We were unable to update your email address.</p>
      <p class="reason">${reason}</p>
      <p class="muted">Please return to the app and try again.</p>
    </div>
  </body></html>`;
};
