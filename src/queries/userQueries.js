import sql from "../config/db.js";
import { queryCreateUserDefaultReminderSettings } from "./userReminderSettingsQueries.js";

export async function queryUserExistsByUsernameOrEmail(username, email) {
  return sql`SELECT id FROM users WHERE username=${username} OR email=${email} LIMIT 1`;
}

// Creates a new user and reminder settings
export async function queryInsertUser(username, fullName, email, gender, hash) {
  return sql.begin(async (trx) => {
    // 1) create the user
    const [user] = await trx`
      INSERT INTO users (username, name, email, gender, password)
      VALUES (${username}, ${fullName}, ${email}, ${gender}, ${hash})
      RETURNING id, username, name, email, gender, role, created_at
    `;

    // 2) create default reminder settings for this user
    await trx`
      INSERT INTO user_reminder_settings (user_id)
      VALUES (${user.id})
    `;

    // 3) return the created user
    return user;
  });
}

export async function queryAuthenticatedUserById(userId) {
  return sql`SELECT to_jsonb(users) - 'password' AS user_data FROM users WHERE id = ${userId}`;
}

export async function queryUsernameOrEmailConflict(username, email, userId) {
  // Cast params to text so Postgres knows their type even when null
  const rows = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM users
      WHERE id <> ${userId}
        AND (
          (${username}::text IS NOT NULL AND lower(username) = lower(${username}::text))
          OR
          (${email}::text IS NOT NULL AND lower(email) = lower(${email}::text))
        )
    ) AS conflict
  `;
  // rows[0] is always defined with a boolean 'conflict' field
  return rows[0]?.conflict === true;
}

export async function queryUpdateAuthenticatedUser(
  userId,
  { username, fullName, gender, hashed, profileImgUrl, pushToken },
  setCompletedOnOAuthUser,
  emailCandidate = null // optional: probe email uniqueness without persisting
) {
  // 1) Optional "fake" email update to trigger unique check
  if (emailCandidate) {
    try {
      await sql`SAVEPOINT email_probe`;
      try {
        await sql`
          UPDATE users
          SET email = ${emailCandidate}
          WHERE id = ${userId}
            AND email IS DISTINCT FROM ${emailCandidate}
        `;
        await sql`ROLLBACK TO SAVEPOINT email_probe`;
      } catch (e) {
        await sql`ROLLBACK TO SAVEPOINT email_probe`;
        if (e.code === "23505") {
          throw e; // unique violation -> will be mapped to 409 by caller
        }
        throw e; // e.g., RLS denial, etc.
      }
    } catch (e) {
      // If not in a transaction block (25P01), just skip the probe gracefully.
      // The final confirm will still guard with the unique index.
      if (e.code !== "25P01") throw e;
    }
  }

  // 2) Real update for non-email fields
  const rows = await sql`
    UPDATE users
    SET
      username          = COALESCE(${username}, username),
      name              = COALESCE(${fullName}, name),
      gender            = COALESCE(${gender}, gender),
      password          = COALESCE(${hashed}, password),
      profile_image_url = COALESCE(${profileImgUrl}, profile_image_url),
      push_token        = COALESCE(${pushToken}, push_token)
    WHERE id = ${userId}
    RETURNING to_jsonb(users) - 'password' AS user_data
  `;

  if (setCompletedOnOAuthUser) {
    await sql`UPDATE oauth_accounts SET missing_fields = NULL WHERE user_id = ${userId}`;
  }

  return rows;
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
