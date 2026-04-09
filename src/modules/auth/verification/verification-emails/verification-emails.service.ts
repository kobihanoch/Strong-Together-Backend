import jwt from 'jsonwebtoken';
import { appConfig } from '../../../../config/app.config.ts';
import { authConfig } from '../../../../config/auth.config.ts';
import { generateJti } from '../../../../shared/authentication/authentication.utils.ts';
import { enqueueEmails } from '../../../../infrastructure/queues/emails/emails-producer.ts';
import { generateValidateUserEmail } from './verification-emails.templates.ts';

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
