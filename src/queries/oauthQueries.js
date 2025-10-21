import sql from "../config/db.js";
import { ensureUniqueUsername } from "../utils/oauthUtils.js";

export async function queryFindUserIdWithGoogleUserId(googleUserId) {
  const rows =
    await sql`SELECT o.user_id, o.missing_fields FROM oauth_accounts o 
    WHERE o.provider_user_id=${googleUserId} AND o.provider='google'`;
  return {
    userId: rows[0]?.user_id || null,
    missing_fields: rows[0]?.missing_fields || null,
  };
}

/**
 * Try to link an existing local user (found by verified email) to Google account.
 * - If a user with this email exists: attach (insert into oauth_accounts), update minimal profile fields.
 * - If no user exists with this email: return null (caller may proceed to create a new user).
 * Returns { userId } on success, or { userId: null } if no matching user.
 *
 * IMPORTANT: call this only when email is verified (email_verified === true).
 */
export async function queryTryToLinkUserWithEmail(googleEmail, googleSub) {
  if (!googleEmail) return { userId: null };

  // Use a transaction to avoid race conditions between lookup and insert.
  return await sql.begin(async (trx) => {
    // Lock the candidate row if it exists to avoid concurrent link races.
    const existing = await trx`
      SELECT u.id
      FROM users u
      WHERE lower(u.email) = lower(${googleEmail}) AND auth_provider='app'
      FOR UPDATE
      LIMIT 1
    `;
    if (existing.length === 0) {
      return { userId: null };
    }
    const userId = existing[0].id;

    // Insert into oauth_accounts; ignore if already linked.
    await trx`
      INSERT INTO oauth_accounts (user_id, provider, provider_user_id, provider_email)
      VALUES (${userId}, 'google', ${googleSub}, ${googleEmail})
      ON CONFLICT (provider, provider_user_id) DO NOTHING
    `;

    // Optionally enrich missing profile fields (do not overwrite user choices).
    // If you want to upsert full_name/picture here, add parameters to this function and COALESCE them.
    await trx`
      UPDATE users
      SET auth_provider = 'google'
      WHERE id = ${userId}
    `;

    return { userId };
  });
}

export async function queryFindUserIdWithAppleUserId(appleUserId) {
  return sql`SELECT o.user_id, u.is_first_login FROM oauth_accounts o WHERE o.provider_user_id=${appleUserId} AND o.provider='apple'`;
}

export async function queryCreateUserWithGoogleInfo(
  candidateUsername,
  email = null,
  fullName = null,
  oauthMissingFields = null,
  googleSub,
  googleEmail
) {
  return await sql.begin(async (trx) => {
    // Generate a unique username
    const username = await ensureUniqueUsername(trx, candidateUsername);

    // Create user
    const inserted = await trx`
      INSERT INTO users(username, email, name, gender, is_verified, auth_provider)
      VALUES (${username}, ${email}, ${fullName}, 'Unknown', true, 'google')
      RETURNING id
    `;
    const newUserId = inserted[0].id;

    // Create oauth link
    await trx`
      INSERT INTO oauth_accounts(user_id, provider, provider_user_id, provider_email, missing_fields)
      VALUES(${newUserId}, 'google', ${googleSub}, ${googleEmail}, ${oauthMissingFields})
    `;

    return newUserId;
  });
}

export async function queryCreateUserWithAppleInfo() {}

export async function queryUserExistsByUsername(username) {
  const [user] = await sql`SELECT id FROM users WHERE username=${username}`;
  return !!user;
}
