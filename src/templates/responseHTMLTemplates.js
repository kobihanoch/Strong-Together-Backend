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
