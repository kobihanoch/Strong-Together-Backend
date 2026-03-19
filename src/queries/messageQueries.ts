import sql from "../config/db.ts";
import {
  AllUserMessages,
  DeletedMessage,
  MessageAsRead,
} from "../types/dto/messages.dto.ts";

// Returns sender's username, full name and profile image path too
/*
 * {
 *   id: .....,
 *   sender_id: ....,
 *   sender_username: ...,
 *   sender_full_name:...,
 *   sender_profile_image_url:...,
 *   receiver_id:...,
 *   subject:.....,
 *   msg:......,
 *   sent_at:....,
 *   is_read: true/false
 * }
 */
export async function queryAllUserMessages(
  userId: string,
  tz: string = "Asia/Jerusalem",
): Promise<AllUserMessages[]> {
  const rows = await sql<AllUserMessages[]>`
    SELECT 
      m.id AS id,
      m.subject AS subject,
      m.msg AS msg,
      m.sent_at AT TIME ZONE ${tz} AS sent_at,
      m.is_read AS is_read,
      u.name AS sender_full_name,
      u.profile_image_url AS sender_profile_image_url
    FROM messages m
    LEFT JOIN users u
      ON u.id = m.sender_id
    WHERE m.receiver_id = ${userId}
    ORDER BY sent_at DESC
  `;

  return rows;
}

export async function queryMarkUserMessageAsRead(
  messageId: string,
  userId: string,
): Promise<MessageAsRead[]> {
  return sql<MessageAsRead[]>`
    UPDATE messages AS m
    SET is_read = TRUE
    WHERE m.id=${messageId} AND m.receiver_id=${userId}
    RETURNING id, is_read
  `;
}

export async function queryDeleteMessage(
  messageId: string,
  userId: string,
): Promise<DeletedMessage[]> {
  return sql<DeletedMessage[]>`
    DELETE FROM messages AS m
    WHERE m.id=${messageId} AND (m.receiver_id=${userId} OR m.sender_id=${userId})
    RETURNING id
  `;
}
