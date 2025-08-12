import sql from "../config/db.js";

export async function queryAllUserMessages(userId) {
  return sql`SELECT * FROM messages WHERE receiver_id=${userId}`;
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
