import postgres from 'postgres';
import sql from '../config/db.ts';
import { AuthenticatedUserForUpdate } from '../types/dto/user.dto.ts';
import { UserEntity } from '../types/entities/user.entity.ts';

export async function queryUserExistsByUsernameOrEmail(
  username: string | null,
  email: string | null,
): Promise<[Pick<UserEntity, 'id'>]> {
  return sql<[Pick<UserEntity, 'id'>]>`
    SELECT id FROM users WHERE username=${username} OR email=${email} LIMIT 1`;
}

// Creates a new user and reminder settings
export async function queryInsertUser(
  username: string,
  fullName: string,
  email: string,
  gender: string | null,
  hash: string,
): Promise<Pick<UserEntity, 'id' | 'username' | 'name' | 'email' | 'gender' | 'role' | 'created_at'>> {
  return sql.begin(async (trx) => {
    // 1) create the user
    const [user] = await trx<
      [Pick<UserEntity, 'id' | 'username' | 'name' | 'email' | 'gender' | 'role' | 'created_at'>]
    >`
      INSERT INTO users (username, name, email, gender, password)
      VALUES (${username}, ${fullName}, ${email}, ${gender}, ${hash})
      RETURNING id, username, name, email, gender, role, created_at
    `;

    // 2) create default reminder settings for this user
    await trx`
      INSERT INTO user_reminder_settings (user_id)
      VALUES (${user.id}::uuid)
    `;

    // 3) return the created user
    return user;
  });
}

export async function queryAuthenticatedUserById(
  userId: string,
): Promise<[{ user_data: Omit<UserEntity, 'password'> }]> {
  return sql<[{ user_data: Omit<UserEntity, 'password'> }]>`
    SELECT to_jsonb(users) - 'password' AS user_data FROM users WHERE id = ${userId}::uuid`;
}

export async function queryUsernameOrEmailConflict(username: string, email: string, userId: string): Promise<boolean> {
  // Cast params to text so Postgres knows their type even when null
  const rows = await sql<[{ conflict: boolean }]>`
    SELECT EXISTS (
      SELECT 1
      FROM users
      WHERE id <> ${userId}::uuid
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
  userId: string,
  { username, fullName, email: emailCandidate }: AuthenticatedUserForUpdate,
): Promise<[{ user_data: Omit<UserEntity, 'password'> }]> {
  // 1) Optional "fake" email update to trigger unique check - if user chose to update his email we only CHECK if email is valid here
  if (emailCandidate) {
    try {
      await sql`SAVEPOINT email_probe`;
      try {
        await sql`
          UPDATE users
          SET email = ${emailCandidate}
          WHERE id = ${userId}::uuid
            AND email IS DISTINCT FROM ${emailCandidate}
        `;
        await sql`ROLLBACK TO SAVEPOINT email_probe`;
      } catch (e) {
        await sql`ROLLBACK TO SAVEPOINT email_probe`;
        if (e instanceof postgres.PostgresError && e.code === '23505') {
          throw e; // unique violation -> will be mapped to 409 by caller
        }
        throw e; // e.g., RLS denial, etc.
      }
    } catch (e) {
      // If not in a transaction block (25P01), just skip the probe gracefully.
      // The final confirm will still guard with the unique index.
      if (e instanceof postgres.PostgresError && e.code !== '25P01') throw e;
    }
  }

  // 2) Real update for non-email fields
  const rows = await sql<[{ user_data: Omit<UserEntity, 'password'> }]>`
    UPDATE users
    SET
      username          = COALESCE(${username ?? null}, username),
      name              = COALESCE(${fullName ?? null}, name)
    WHERE id = ${userId}::uuid
    RETURNING to_jsonb(users) - 'password' AS user_data
  `;

  return rows;
}

export async function queryDeleteUserById(id: string): Promise<void> {
  await sql`DELETE FROM users WHERE id=${id}::uuid`;
}

export async function queryUserUsernamePicAndName(
  id: string,
): Promise<[Pick<UserEntity, 'id' | 'username' | 'profile_image_url' | 'name'>]> {
  return sql<[Pick<UserEntity, 'id' | 'username' | 'profile_image_url' | 'name'>]>`
    SELECT id, username, profile_image_url, name FROM users WHERE id=${id}::uuid`;
}

export const queryGetUserProfilePicURL = async (userId: string): Promise<[Pick<UserEntity, 'profile_image_url'>]> => {
  return sql<[Pick<UserEntity, 'profile_image_url'>]>`
    SELECT profile_image_url FROM users WHERE id=${userId}::uuid LIMIT 1`;
};

export const queryUpdateUserProfilePicURL = async (
  userId: string,
  newURL: string | null,
): Promise<[Pick<UserEntity, 'profile_image_url'>]> => {
  return sql<
    [Pick<UserEntity, 'profile_image_url'>]
  >`UPDATE users SET profile_image_url=${newURL} WHERE id=${userId}::uuid RETURNING profile_image_url`;
};
