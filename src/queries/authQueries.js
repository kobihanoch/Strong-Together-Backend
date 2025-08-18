import sql from "../config/db.js";

export async function queryUserByUsernameForLogin(username) {
  return sql`SELECT id, password, role, is_first_login, name FROM users WHERE username=${username} LIMIT 1`;
}

export async function querySetUserFirstLoginFalse(userId) {
  return sql`UPDATE users SET is_first_login=FALSE WHERE id=${userId} RETURNING id`;
}

export async function queryUserDataByUsername(username) {
  return sql`SELECT to_jsonb(users) - 'password' AS user_data FROM users WHERE username = ${username} LIMIT 1`;
}

export async function queryDeleteExpiredBlacklistedTokens() {
  return sql`DELETE FROM blacklistedtokens WHERE expires_at < now()`;
}

export async function querySelectBlacklistedToken(token) {
  return sql`SELECT token FROM blacklistedtokens WHERE token=${token} LIMIT 1`;
}

export async function queryUserIdRoleById(userId) {
  return sql`SELECT id, role FROM users WHERE id=${userId} LIMIT 1`;
}

export async function queryInsertBlacklistedToken(token, expiresAt) {
  return sql`
    INSERT INTO blacklistedtokens (token, expires_at)
    VALUES (${token}, ${expiresAt})
    ON CONFLICT (token) DO NOTHING
  `;
}

export const queryUpdateExpoPushTokenToNull = async (userId) => {
  return sql`UPDATE users SET push_token=NULL WHERE id=${userId}`;
};
