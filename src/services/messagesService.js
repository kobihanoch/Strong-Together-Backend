import sql from "../config/db.js";
import {
  getEndOfWorkoutMessage,
  getFirstLoginMessage,
} from "../templates/messageTemplates.js";

export const sendSystemMessageToUserWorkoutDone = async (receiverId) => {
  const msg = getEndOfWorkoutMessage();
  const senderId = process.env.SYSTEM_USER_ID;

  const rows =
    await sql`INSERT INTO messages (sender_id, receiver_id, subject, msg) VALUES (${senderId}, ${receiverId}, ${msg.header}, ${msg.text}) RETURNING id`;

  return rows.length ? rows[0].id : null;
};

export const sendSystemMessageToUserWhenFirstLogin = async (
  receiverId,
  receiverName
) => {
  const msg = getFirstLoginMessage(receiverName);
  const senderId = process.env.SYSTEM_USER_ID;

  const rows =
    await sql`INSERT INTO messages (sender_id, receiver_id, subject, msg) VALUES (${senderId}, ${receiverId}, ${msg.header}, ${msg.text}) RETURNING id`;

  return rows.length ? rows[0].id : null;
};
