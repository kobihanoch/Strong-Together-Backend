import sql from "../config/db.js";
import {
  getEndOfWorkoutMessage,
  getFirstLoginMessage,
} from "../templates/messageTemplates.js";
import { emitNewMessage } from "../utils/socketUtils.js";

export const sendSystemMessageToUserWorkoutDone = async (receiverId) => {
  const msg = getEndOfWorkoutMessage();
  const senderId = process.env.SYSTEM_USER_ID;

  const [row] = await sql`
  WITH inserted AS (
    INSERT INTO messages (sender_id, receiver_id, subject, msg)
    VALUES (${senderId}, ${receiverId}, ${msg.header}, ${msg.text})
    RETURNING *
  )
  SELECT
    inserted.*,
    u.username          AS sender_username,
    u.name              AS sender_full_name,
    u.profile_image_url AS sender_profile_image_url,
    u.gender            AS sender_gender
  FROM inserted
  LEFT JOIN users u ON u.id = inserted.sender_id
`;

  // Send in socket too
  emitNewMessage(receiverId, row);
  return row?.id ?? null;
};

export const sendSystemMessageToUserWhenFirstLogin = async (
  receiverId,
  receiverName
) => {
  const msg = getFirstLoginMessage(receiverName);

  const senderId = process.env.SYSTEM_USER_ID;

  const [row] = await sql`
  WITH inserted AS (
    INSERT INTO messages (sender_id, receiver_id, subject, msg)
    VALUES (${senderId}, ${receiverId}, ${msg.header}, ${msg.text})
    RETURNING *
  )
  SELECT
    inserted.*,
    u.username          AS sender_username,
    u.name              AS sender_full_name,
    u.profile_image_url AS sender_profile_image_url,
    u.gender            AS sender_gender
  FROM inserted
  LEFT JOIN users u ON u.id = inserted.sender_id
`;

  // Send in socket too
  emitNewMessage(receiverId, row);
  return row?.id ?? null;
};
