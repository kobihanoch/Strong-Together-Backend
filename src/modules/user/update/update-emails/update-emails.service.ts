import jwt from 'jsonwebtoken';
import { generateJti } from '../../../../common/authentication/authentication.utils.ts';
import { authConfig } from '../../../../config/auth.config.ts';
import { appConfig } from '../../../../config/app.config.ts';
import { generateConfirmEmailChange } from './update-emails.templates.ts';
import { enqueueEmails } from '../../../../infrastructure/queues/emails/emails-producer.ts';

type EmailContext = {
  requestId?: string;
};

const base = appConfig.publicBaseUrl;

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
