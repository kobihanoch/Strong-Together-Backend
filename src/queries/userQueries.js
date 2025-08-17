import sql from "../config/db.js";

export async function queryUserExistsByUsernameOrEmail(username, email) {
  return sql`SELECT id FROM users WHERE username=${username} OR email=${email} LIMIT 1`;
}

export async function queryInsertUser(username, fullName, email, gender, hash) {
  return sql`
    INSERT INTO users (username, name, email, gender, password)
    VALUES (${username}, ${fullName}, ${email}, ${gender}, ${hash})
    RETURNING id, username, name, email, gender, role, created_at
  `;
}

export async function queryAuthenticatedUserById(userId) {
  return sql`SELECT to_jsonb(users) - 'password' AS user_data FROM users WHERE id = ${userId}`;
}

export async function queryUsernameOrEmailConflict(username, email, userId) {
  return sql`
      SELECT 1 FROM users
      WHERE (username=${username} OR email=${email})
        AND id <> ${userId}
      LIMIT 1
  `;
}

export async function queryUpdateAuthenticatedUser(
  userId,
  { username, fullName, email, gender, hashed, profileImgUrl, pushToken }
) {
  return sql`
    UPDATE users
    SET
      username          = COALESCE(${username}, username),
      name              = COALESCE(${fullName}, name),
      email             = COALESCE(${email}, email),
      gender            = COALESCE(${gender}, gender),
      password          = COALESCE(${hashed}, password),
      profile_image_url = COALESCE(${profileImgUrl}, profile_image_url),
      push_token        = COALESCE(${pushToken}, push_token)
    WHERE id = ${userId}
    RETURNING to_jsonb(users) - 'password' AS user_data
  `;
}

export async function queryDeleteUserById(id) {
  return sql`DELETE FROM users WHERE id=${id}`;
}

export async function queryUserUsernamePicAndName(id) {
  return sql`SELECT id, username, profile_image_url, name FROM users WHERE id=${id}`;
}

export const queryGetUserProfilePicURL = async (userId) => {
  return sql`SELECT profile_image_url FROM users WHERE id=${userId} LIMIT 1`;
};

export const queryUpdateUserProfilePicURL = async (userId, newURL) => {
  return sql`UPDATE users SET profile_image_url=${newURL} WHERE id=${userId} RETURNING profile_image_url`;
};
