import { sendMail } from "../config/mailer.js";
import {
  generateForgotPasswordEmail,
  generateValidateUserEmail,
} from "../templates/emailTemplates.js";
import jwt from "jsonwebtoken";

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
  await sendMail({ to: email, subject: "Verify your email", html });
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
