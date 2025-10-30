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
export async function queryTryToLinkUserWithEmailGoogle(
  googleEmail,
  googleSub
) {
  if (!googleEmail) return { userId: null };

  // Use a transaction to avoid race conditions between lookup and insert.
  return await sql.begin(async (trx) => {
    // Lock the candidate row if it exists to avoid concurrent link races.
    const existing = await trx`
      SELECT u.id
      FROM users u
      WHERE lower(u.email) = lower(${googleEmail})
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
    const [inserted] = await trx`
      INSERT INTO users (username, email, name, gender, is_verified, auth_provider)
      VALUES (${username}, ${email}, ${fullName}, 'Unknown', true, 'google')
      RETURNING id
    `;
    const newUserId = inserted.id;

    // Create oauth link
    await trx`
      INSERT INTO oauth_accounts (user_id, provider, provider_user_id, provider_email, missing_fields)
      VALUES (${newUserId}, 'google', ${googleSub}, ${googleEmail}, ${oauthMissingFields})
    `;

    // Create default reminder settings
    await trx`
      INSERT INTO user_reminder_settings (user_id)
      VALUES (${newUserId})
    `;

    return newUserId;
  });
}

// ------------------------------------------------------------------------
// APPLE

/** Same shape as the Google version: returns { userId, missing_fields } */
export async function queryFindUserIdWithAppleUserId(appleUserId) {
  const rows =
    await sql`SELECT o.user_id, o.missing_fields FROM oauth_accounts o 
              WHERE o.provider_user_id=${appleUserId} AND o.provider='apple'`;
  return {
    userId: rows[0]?.user_id || null,
    missing_fields: rows[0]?.missing_fields || null,
  };
}

/** Link by verified email specifically for Apple */
export async function queryTryToLinkUserWithEmailApple(appleEmail, appleSub) {
  if (!appleEmail) return { userId: null };

  // Use a transaction to avoid race conditions
  return await sql.begin(async (trx) => {
    const existing = await trx`
      SELECT u.id
      FROM users u
      WHERE lower(u.email) = lower(${appleEmail})
      FOR UPDATE
      LIMIT 1
    `;
    if (existing.length === 0) {
      return { userId: null };
    }
    const userId = existing[0].id;

    // Insert oauth link for Apple (idempotent)
    await trx`
      INSERT INTO oauth_accounts (user_id, provider, provider_user_id, provider_email)
      VALUES (${userId}, 'apple', ${appleSub}, ${appleEmail})
      ON CONFLICT (provider, provider_user_id) DO NOTHING
    `;

    // Mark auth_provider without overwriting user-chosen fields
    await trx`
      UPDATE users
      SET auth_provider = 'apple'
      WHERE id = ${userId}
    `;

    return { userId };
  });
}

/** Create brand new user + oauth link for Apple (mirrors the Google variant) */
export async function queryCreateUserWithAppleInfo(
  candidateUsername,
  email = null,
  fullName = null,
  oauthMissingFields = null,
  appleSub,
  appleEmail
) {
  return await sql.begin(async (trx) => {
    // Generate unique username
    const username = await ensureUniqueUsername(trx, candidateUsername);

    // Create user
    const [inserted] = await trx`
      INSERT INTO users (username, email, name, gender, is_verified, auth_provider)
      VALUES (${username}, ${email}, ${fullName}, 'Unknown', true, 'apple')
      RETURNING id
    `;
    const newUserId = inserted.id;

    // Create oauth link
    await trx`
      INSERT INTO oauth_accounts (user_id, provider, provider_user_id, provider_email, missing_fields)
      VALUES (${newUserId}, 'apple', ${appleSub}, ${appleEmail}, ${oauthMissingFields})
    `;

    // Create default reminder settings
    await trx`
      INSERT INTO user_reminder_settings (user_id)
      VALUES (${newUserId})
    `;

    return newUserId;
  });
}
