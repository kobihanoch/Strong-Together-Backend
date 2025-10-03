import sql from "../config/db.js";

export async function queryUserByUsernameForLogin(username) {
  return sql`SELECT id, password, role, is_first_login, name FROM users WHERE username=${username} LIMIT 1`;
}

export async function querySetUserFirstLoginFalse(userId) {
  return sql`UPDATE users SET is_first_login=FALSE WHERE id=${userId} RETURNING id`;
}

export async function queryUserDataByUsername(username) {
  return sql`UPDATE users SET token_version=token_version + 1 WHERE username = ${username} RETURNING token_version, (to_jsonb(users) - 'password' - 'token_version') AS user_data`;
}

export async function queryDeleteExpiredBlacklistedTokens() {
  return sql`DELETE FROM blacklistedtokens WHERE expires_at < now()`;
}

export async function querySelectBlacklistedToken(token) {
  return sql`SELECT 1 FROM blacklistedtokens WHERE token=${token} LIMIT 1`;
}

export const queryGetCurrentTokenVersion = async (userId) => {
  return sql`SELECT token_version FROM users WHERE id=${userId}`;
};

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

export const queryUpdateUserVerficiationStatus = async (userId, state) => {
  await sql`UPDATE users SET is_verified = ${state} WHERE users.id = ${userId}`;
};
