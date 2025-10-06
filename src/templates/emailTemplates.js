// English comments only inside the code
export const generateValidateUserEmail = ({ fullName, verifyUrl, logoUrl }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Verify your account</title>
    <style>
      /* Minimal resets (email-safe). Most styles inline below. */
      body { margin:0; padding:0; background:#f9f9f9; }
      img { border:0; line-height:100%; text-decoration:none; -ms-interpolation-mode:bicubic; display:block; }
      table { border-collapse:collapse; }
      a { text-decoration:none; }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#f9f9f9;">
    <!-- Preheader -->
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;color:transparent;">
      Verify your Strong Together account.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;">
      <tr>
        <td align="center" style="padding:40px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.05);">
            <tr>
              <td style="padding:30px;">
                <table role="presentation" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom:16px;">
                      <img src="${logoUrl}" width="96" height="96" alt="Strong Together" style="border-radius:16px;" />
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 8px 0;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:28px;line-height:1.3;color:#333;text-align:center;">
                  Verify Your Account
                </p>
                <p style="margin:0;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:14px;line-height:1.6;color:#555;text-align:center;">
                  Hi <strong>${fullName}</strong>, please verify your email to activate your account.
                </p>

                <table role="presentation" width="100%" style="margin-top:24px;background:#f1f1f1;border-radius:6px;">
                  <tr>
                    <td align="center" style="padding:24px;">
                      <p style="margin:0 0 16px;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:14px;color:#555;">
                        Click the button to verify your account:
                      </p>

                      <a href="${verifyUrl}" target="_blank" rel="noopener noreferrer"
                         style="background:#2979ff;color:#fff;display:inline-block;padding:12px 24px;border-radius:16px;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:18px;">
                        Verify
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:32px 0 0;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:12px;color:#aaa;text-align:center;">
                  This is an automated email — please do not reply.<br/>
                  © Strong Together
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const generateForgotPasswordEmail = ({
  fullName,
  changePasswordUrl,
  logoUrl,
}) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Confirm your password change</title>
    <style>
      /* Minimal resets (email-safe) */
      body { margin:0; padding:0; background:#f9f9f9; }
      img { border:0; line-height:100%; text-decoration:none; -ms-interpolation-mode:bicubic; display:block; }
      table { border-collapse:collapse; }
      a { text-decoration:none; }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#f9f9f9;">
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;color:transparent;">
      Confirm your Strong Together password change.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;">
      <tr>
        <td align="center" style="padding:40px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.05);">
            <tr>
              <td style="padding:30px;">
                <table role="presentation" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom:16px;">
                      <img src="${logoUrl}" width="96" height="96" alt="Strong Together" style="border-radius:16px;" />
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 8px 0;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:28px;line-height:1.3;color:#333;text-align:center;">
                  Confirm Password Change
                </p>
                <p style="margin:0;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:14px;line-height:1.6;color:#555;text-align:center;">
                  Hi <strong>${fullName}</strong>, tap the button below to continue to reset password page.
                </p>

                <table role="presentation" width="100%" style="margin-top:24px;background:#f1f1f1;border-radius:6px;">
                  <tr>
                    <td align="center" style="padding:24px;">
                      <a href="${changePasswordUrl}" target="_blank" rel="noopener noreferrer"
                         style="background:#2979ff;color:#fff;display:inline-block;padding:12px 24px;border-radius:16px;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:18px;">
                        Reset password
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:24px 0 0;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:12px;color:#888;text-align:center;">
                  If you didn’t request this, you can safely ignore this email.
                </p>

                <p style="margin:16px 0 0;font-family:Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:12px;color:#aaa;text-align:center;">
                  This is an automated email — please do not reply.<br/>
                  © Strong Together
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
