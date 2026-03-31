import { MessageAfterSendResponse } from './../types/dto/messages.dto.ts';
import sql from '../config/db.ts';
import { getEndOfWorkoutMessage, getFirstLoginMessage } from '../templates/messageTemplates.ts';
import { emitNewMessage } from '../utils/socketUtils.js';

export const sendSystemMessageToUserWorkoutDone = async (receiverId: string): Promise<void> => {
  const msg = getEndOfWorkoutMessage();
  const senderId = process.env.SYSTEM_USER_ID!;

  const [row] = await sql<[MessageAfterSendResponse]>`
  WITH inserted AS (
    INSERT INTO messages (sender_id, receiver_id, subject, msg)
    VALUES (${senderId}::uuid, ${receiverId}::uuid, ${msg.header}, ${msg.text})
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
  return;
};

export const sendSystemMessageToUserWhenFirstLogin = async (
  receiverId: string,
  receiverName: string,
): Promise<void> => {
  const msg = getFirstLoginMessage(receiverName);

  const senderId = process.env.SYSTEM_USER_ID!;

  const [row] = await sql<[MessageAfterSendResponse]>`
  WITH inserted AS (
    INSERT INTO messages (sender_id, receiver_id, subject, msg)
    VALUES (${senderId}::uuid, ${receiverId}::uuid, ${msg.header}, ${msg.text})
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
  return;
};
