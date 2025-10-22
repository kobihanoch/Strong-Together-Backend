import jwt from "jsonwebtoken";
import { sendMail } from "../config/mailer.js";
import {
  generateConfirmEmailChange,
  generateForgotPasswordEmail,
  generateValidateUserEmail,
} from "../templates/emailTemplates.js";
import { generateJti } from "../utils/tokenUtils.js";

const base = process.env.PUBLIC_BASE_URL;

export const sendVerificationEmail = async (email, userId, fullName) => {
  const token = jwt.sign(
    { sub: userId, typ: "email-verify" }, // payload
    process.env.JWT_VERIFY_SECRET, // strong secret in env
    { expiresIn: "1h", issuer: "strong-together" } // claims
  );
  const verifyUrl = `${base}/api/auth/verify?token=${encodeURIComponent(
    token
  )}`;
  const html = generateValidateUserEmail({
    fullName,
    verifyUrl,
    logoUrl: `https://portfolio.kobihanoch.com/images/strongtogethericon.png`,
  });
  await sendMail({
    to: email,
    subject: "Confirm your Strong Together account",
    html,
  });
};

export const sendForgotPasswordEmail = async (email, userId, fullName) => {
  const token = jwt.sign(
    { sub: userId, typ: "forgot-pass" }, // payload
    process.env.JWT_FORGOT_PASSWORD_SECRET, // strong secret in env
    { expiresIn: "5m", issuer: "strong-together" } // claims
  );
  const changePasswordUrl = `https://strongtogether-privacy.kobihanoch.com/reset-password?token=${encodeURIComponent(
    token
  )}`;
  const html = generateForgotPasswordEmail({
    fullName,
    changePasswordUrl,
    logoUrl: `https://portfolio.kobihanoch.com/images/strongtogethericon.png`,
  });
  await sendMail({ to: email, subject: "Reset your password", html });
};

export const sendVerificationEmailForEmailUpdate = async (
  newEmail,
  userId,
  fullName
) => {
  const normalized = newEmail.trim().toLowerCase();
  const jti = generateJti();

  const token = jwt.sign(
    {
      sub: userId,
      typ: "email_confirm",
      newEmail: normalized,
      jti,
      iss: "strong-together",
    },
    process.env.CHANGE_EMAIL_SECRET,
    { expiresIn: "10m" }
  );

  const confirmUrl = `${base}/api/users/changeemail?token=${encodeURIComponent(
    token
  )}`;

  const html = generateConfirmEmailChange({
    fullName,
    confirmUrl,
    logoUrl: "https://portfolio.kobihanoch.com/images/strongtogethericon.png",
  });

  await sendMail({
    to: normalized,
    subject: "Confirm your Strong Together Email",
    html,
  });
};
