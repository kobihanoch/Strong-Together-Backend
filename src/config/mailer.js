import { Resend } from "resend";
import createError from "http-errors";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({
      from: "Strong Together <no-reply@auth.kobihanoch.com>",
      to,
      subject,
      html,
    });
    console.log("An email has been sent to", to);
  } catch (err) {
    console.error("Failed to send email via Resend:", err);
    throw createError(500, err);
  }
};
