import sql from "../config/db.js";

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
export async function queryAllUserMessages(userId) {
  return sql`
    SELECT 
      m.*,
      u.username AS sender_username,
      u.name AS sender_full_name,
      u.profile_image_url AS sender_profile_image_url,
      u.gender AS sender_gender
    FROM messages m
    LEFT JOIN users u
      ON u.id = m.sender_id
    WHERE m.receiver_id = ${userId}
  `;
}

export async function queryMarkUserMessageAsRead(messageId, userId) {
  return sql`
    UPDATE messages AS m
    SET is_read = TRUE
    WHERE m.id=${messageId} AND m.receiver_id=${userId}
    RETURNING id, is_read
  `;
}

export async function queryDeleteMessage(messageId, userId) {
  return sql`
    DELETE FROM messages AS m
    WHERE m.id=${messageId} AND (m.receiver_id=${userId} OR m.sender_id=${userId})
    RETURNING id
  `;
}
