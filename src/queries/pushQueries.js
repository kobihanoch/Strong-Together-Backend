import sql from "../config/db.js";

export const queryGetAllUsersWithNotificationsEnabled = async () => {
  return await sql`SELECT push_token, name FROM users WHERE push_token IS NOT NULL`;
};
