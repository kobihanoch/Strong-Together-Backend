import jwt from 'jsonwebtoken';
import { appConfig } from '../../config/app.config.ts';
import { authConfig } from '../../config/auth.config.ts';
import { enqueueEmails } from '../queues/emails/emails-producer.ts';
import {
  generateConfirmEmailChange,
  generateForgotPasswordEmail,
  generateValidateUserEmail,
} from '../templates/email-templates.js';
import { generateJti } from '../authentication/authentication.utils.ts';

const base = appConfig.publicBaseUrl;
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
    { sub: userId, typ: 'email-verify', jti, iss: 'strong-together' }, // payload
    authConfig.jwtVerifySecret, // strong secret in env
    { expiresIn: '1h' }, // claims
  );
  const verifyUrl = `${base}/api/auth/verify?token=${encodeURIComponent(token)}`;
  const html = generateValidateUserEmail({
    fullName,
    verifyUrl,
    logoUrl: `https://strongtogether.kobihanoch.com/appicon.png`,
  });
  await enqueueEmails([
    {
      to: email,
      subject: 'Confirm your Strong Together account',
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
    { sub: userId, typ: 'forgot-pass', jti, iss: 'strong-together' }, // payload
    authConfig.jwtForgotPasswordSecret, // strong secret in env
    { expiresIn: '5m' }, // claims
  );
  const changePasswordUrl = `https://strongtogether.kobihanoch.com/reset-password?token=${encodeURIComponent(token)}`;
  const html = generateForgotPasswordEmail({
    fullName,
    changePasswordUrl,
    logoUrl: `https://strongtogether.kobihanoch.com/appicon.png`,
  });
  await enqueueEmails([
    {
      to: email,
      subject: 'Reset your password',
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
      typ: 'email-confirm',
      newEmail: normalized,
      jti,
      iss: 'strong-together',
    },
    authConfig.changeEmailSecret,
    { expiresIn: '10m' },
  );

  const confirmUrl = `${base}/api/users/changeemail?token=${encodeURIComponent(token)}`;

  const html = generateConfirmEmailChange({
    fullName,
    confirmUrl,
    logoUrl: 'https://strongtogether.kobihanoch.com/appicon.png',
  });

  await enqueueEmails([
    {
      to: normalized,
      subject: 'Confirm your Strong Together Email',
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
