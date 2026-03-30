import jwt from "jsonwebtoken";
import { enqueueEmails } from "../queues/emails/emailsProducer.ts";
import {
  generateConfirmEmailChange,
  generateForgotPasswordEmail,
  generateValidateUserEmail,
} from "../templates/emailTemplates.js";
import { generateJti } from "../utils/tokenUtils.js";

const base = process.env.PUBLIC_BASE_URL;
type EmailContext = {
  requestId?: string;
};

export const sendVerificationEmail = async (
  email: string,
  userId: string,
  fullName: string,
  context: EmailContext = {},
): Promise<void> => {
  const jti = generateJti();
  const token = jwt.sign(
    { sub: userId, typ: "email-verify", jti, iss: "strong-together" }, // payload
    process.env.JWT_VERIFY_SECRET || "", // strong secret in env
    { expiresIn: "1h" }, // claims
  );
  const verifyUrl = `${base}/api/auth/verify?token=${encodeURIComponent(
    token,
  )}`;
  const html = generateValidateUserEmail({
    fullName,
    verifyUrl,
    logoUrl: `https://strongtogether.kobihanoch.com/appicon.png`,
  });
  await enqueueEmails([
    {
      to: email,
      subject: "Confirm your Strong Together account",
      html,
      ...(context.requestId ? { requestId: context.requestId } : {}),
    },
  ]);
  /*await sendMail({
    to: email,
    subject: "Confirm your Strong Together account",
    html,
  });*/
};

export const sendForgotPasswordEmail = async (
  email: string,
  userId: string,
  fullName: string,
  context: EmailContext = {},
) => {
  const jti = generateJti();
  const token = jwt.sign(
    { sub: userId, typ: "forgot-pass", jti, iss: "strong-together" }, // payload
    process.env.JWT_FORGOT_PASSWORD_SECRET || "", // strong secret in env
    { expiresIn: "5m" }, // claims
  );
  const changePasswordUrl = `https://strongtogether.kobihanoch.com/reset-password?token=${encodeURIComponent(
    token,
  )}`;
  const html = generateForgotPasswordEmail({
    fullName,
    changePasswordUrl,
    logoUrl: `https://strongtogether.kobihanoch.com/appicon.png`,
  });
  await enqueueEmails([
    {
      to: email,
      subject: "Reset your password",
      html,
      ...(context.requestId ? { requestId: context.requestId } : {}),
    },
  ]);
  //await sendMail({ to: email, subject: "Reset your password", html });
};

export const sendVerificationEmailForEmailUpdate = async (
  newEmail: string,
  userId: string,
  fullName: string,
  context: EmailContext = {},
) => {
  const normalized = newEmail.trim().toLowerCase();
  const jti = generateJti();

  const token = jwt.sign(
    {
      sub: userId,
      typ: "email-confirm",
      newEmail: normalized,
      jti,
      iss: "strong-together",
    },
    process.env.CHANGE_EMAIL_SECRET || "",
    { expiresIn: "10m" },
  );

  const confirmUrl = `${base}/api/users/changeemail?token=${encodeURIComponent(
    token,
  )}`;

  const html = generateConfirmEmailChange({
    fullName,
    confirmUrl,
    logoUrl: "https://strongtogether.kobihanoch.com/appicon.png",
  });

  await enqueueEmails([
    {
      to: normalized,
      subject: "Confirm your Strong Together Email",
      html,
      ...(context.requestId ? { requestId: context.requestId } : {}),
    },
  ]);
  /*await sendMail({
    to: normalized,
    subject: "Confirm your Strong Together Email",
    html,
  });*/
};
