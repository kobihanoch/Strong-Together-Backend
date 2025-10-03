import { sendMail } from "../config/mailer.js";
import { generateValidateUserEmail } from "../templates/emailTemplates.js";
import { buildVerifyUrl } from "../utils/verificationUtils.js";

export const sendVerificationEmail = async (email, userId, fullName) => {
  const verifyUrl = buildVerifyUrl(userId);
  const html = generateValidateUserEmail({
    fullName,
    verifyUrl,
    logoUrl: `https://github.com/user-attachments/assets/b30f6b34-859c-4884-9ef0-6b196497356d`,
  });
  await sendMail({ to: email, subject: "Verify your email", html });
};
