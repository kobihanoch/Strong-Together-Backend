import postgres from 'postgres';
import type { AerobicEntity, UserEntity } from '@strong-together/shared';
import { appConfig } from '../../../config/app.config';
import { databaseConfig } from '../../../config/database.config';

const sql = postgres(databaseConfig.url, {
  ssl: appConfig.isTest ? false : 'require',
  prepare: false,
  connect_timeout: 30,
});

const testPasswordHash = '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi';

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getExerciseToWorkoutSplitId(userId: string, splitName: string, exerciseId: number) {
  const rows = await sql<{ id: number }[]>`
    SELECT ets.id
    FROM public.exercisetoworkoutsplit ets
    INNER JOIN public.workoutsplits ws ON ws.id = ets.workoutsplit_id
    INNER JOIN public.workoutplans wp ON wp.id = ws.workout_id
    WHERE wp.user_id = ${userId}::uuid
      AND wp.is_active = TRUE
      AND ws.is_active = TRUE
      AND ets.is_active = TRUE
      AND ws.name = ${splitName}
      AND ets.exercise_id = ${exerciseId}
    LIMIT 1
  `;

  return rows[0] ? Number(rows[0].id) : null;
}

export async function getWorkoutSplitId(userId: string, splitName: string) {
  const rows = await sql<{ id: number }[]>`
    SELECT ws.id
    FROM public.workoutsplits ws
    INNER JOIN public.workoutplans wp ON wp.id = ws.workout_id
    WHERE wp.user_id = ${userId}::uuid
      AND wp.is_active = TRUE
      AND ws.is_active = TRUE
      AND ws.name = ${splitName}
    LIMIT 1
  `;

  return rows[0] ? Number(rows[0].id) : null;
}

export async function getActiveWorkoutSplitNames(userId: string) {
  const rows = await sql<{ name: string | null }[]>`
    SELECT ws.name
    FROM public.workoutsplits ws
    INNER JOIN public.workoutplans wp ON wp.id = ws.workout_id
    WHERE wp.user_id = ${userId}::uuid
      AND wp.is_active = TRUE
      AND ws.is_active = TRUE
    ORDER BY ws.id
  `;

  return rows.map((row: { name: string | null }) => row.name);
}

export async function getInactiveWorkoutSplitNames(userId: string) {
  const rows = await sql<{ name: string | null }[]>`
    SELECT ws.name
    FROM public.workoutsplits ws
    INNER JOIN public.workoutplans wp ON wp.id = ws.workout_id
    WHERE wp.user_id = ${userId}::uuid
      AND wp.is_active = TRUE
      AND ws.is_active = FALSE
    ORDER BY ws.id
  `;

  return rows.map((row: { name: string | null }) => row.name);
}

export async function getExercisesForSplit(userId: string, splitName: string) {
  const rows = await sql<{ exercise_id: number | null; sets: number[] | null; order_index: number | null }[]>`
    SELECT ets.exercise_id, ets.sets, ets.order_index
    FROM public.exercisetoworkoutsplit ets
    INNER JOIN public.workoutsplits ws ON ws.id = ets.workoutsplit_id
    INNER JOIN public.workoutplans wp ON wp.id = ws.workout_id
    WHERE wp.user_id = ${userId}::uuid
      AND wp.is_active = TRUE
      AND ws.is_active = TRUE
      AND ets.is_active = TRUE
      AND ws.name = ${splitName}
    ORDER BY ets.order_index
  `;

  return rows.map((row: { exercise_id: number | null; sets: number[] | null; order_index: number | null }) => ({
    exerciseId: row.exercise_id === null ? null : Number(row.exercise_id),
    sets: row.sets?.map((set: number) => Number(set)) ?? null,
    orderIndex: row.order_index === null ? null : Number(row.order_index),
  }));
}

export async function getInactiveExercisesForSplit(userId: string, splitName: string) {
  const rows = await sql<{ exercise_id: number | null }[]>`
    SELECT ets.exercise_id
    FROM public.exercisetoworkoutsplit ets
    INNER JOIN public.workoutsplits ws ON ws.id = ets.workoutsplit_id
    INNER JOIN public.workoutplans wp ON wp.id = ws.workout_id
    WHERE wp.user_id = ${userId}::uuid
      AND wp.is_active = TRUE
      AND ws.name = ${splitName}
      AND ets.is_active = FALSE
    ORDER BY ets.id
  `;

  return rows.map((row: { exercise_id: number | null }) => (row.exercise_id === null ? null : Number(row.exercise_id)));
}

export async function getWorkoutSummaryCount(userId: string) {
  const [row] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count
    FROM public.workout_summary
    WHERE user_id = ${userId}::uuid
  `;

  return Number(row?.count ?? '0');
}

export async function getExerciseTrackingCountForUser(userId: string) {
  const [row] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count
    FROM public.exercisetracking et
    INNER JOIN public.workout_summary ws ON ws.id = et.workout_summary_id
    WHERE ws.user_id = ${userId}::uuid
  `;

  return Number(row?.count ?? '0');
}

export async function getUserReminderTimezone(userId: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const [row] = await sql<{ timezone: string | null }[]>`
      SELECT urs.timezone
      FROM public.user_reminder_settings urs
      WHERE urs.user_id = ${userId}::uuid
      LIMIT 1
    `;

    if (row?.timezone && row.timezone !== "'UTC'::text") {
      return row.timezone;
    }

    if (attempt < 9) {
      await wait(25);
    }
  }

  const [row] = await sql<{ timezone: string | null }[]>`
    SELECT urs.timezone
    FROM public.user_reminder_settings urs
    WHERE urs.user_id = ${userId}::uuid
    LIMIT 1
  `;

  return row?.timezone ?? null;
}

export async function getMessageReadState(messageId: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const [row] = await sql<{ is_read: boolean | null }[]>`
      SELECT m.is_read
      FROM public.messages m
      WHERE m.id = ${messageId}::uuid
      LIMIT 1
    `;

    if (row?.is_read === true) {
      return true;
    }

    if (attempt < 9) {
      await wait(25);
    }
  }

  return false;
}

export async function messageExists(messageId: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const [row] = await sql<{ count: string }[]>`
      SELECT COUNT(*)::text AS count
      FROM public.messages m
      WHERE m.id = ${messageId}::uuid
    `;

    if (Number(row?.count ?? '0') === 0) {
      return false;
    }

    if (attempt < 9) {
      await wait(25);
    }
  }

  return true;
}

export async function getAerobicsRowsForUser(userId: string) {
  const rows = await sql<Pick<AerobicEntity, 'id' | 'type' | 'duration_mins' | 'duration_sec' | 'workout_time_utc'>[]>`
    SELECT at.id, at.type, at.duration_mins, at.duration_sec, at.workout_time_utc
    FROM public.aerobictracking at
    WHERE at.user_id = ${userId}::uuid
    ORDER BY at.id ASC
  `;

  return rows.map((row: Pick<AerobicEntity, 'id' | 'type' | 'duration_mins' | 'duration_sec' | 'workout_time_utc'>) => ({
    id: Number(row.id),
    type: row.type,
    duration_mins: Number(row.duration_mins),
    duration_sec: Number(row.duration_sec),
    workout_time_utc: row.workout_time_utc,
  }));
}

export async function waitForAerobicsRowsForUser(userId: string, expectedCount: number) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const rows = await getAerobicsRowsForUser(userId);

    if (rows.length === expectedCount) {
      return rows;
    }

    if (attempt < 9) {
      await wait(25);
    }
  }

  return getAerobicsRowsForUser(userId);
}

export async function getUserAuthStateByUsername(username: string) {
  const [row] = await sql<
    Pick<UserEntity, 'id' | 'username' | 'email' | 'name' | 'gender' | 'role' | 'password' | 'is_verified'>[]
  >`
    SELECT id, username, email, name, gender, role, password, is_verified
    FROM public.users
    WHERE username = ${username}
    LIMIT 1
  `;

  return row ?? null;
}

export async function createVerifiedTestUser(overrides: {
  username: string;
  email?: string;
  fullName?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Unknown';
  isFirstLogin?: boolean;
  isVerified?: boolean;
}) {
  const [row] = await sql<{ id: string }[]>`
    INSERT INTO public.users (
      username,
      email,
      name,
      gender,
      password,
      role,
      is_first_login,
      token_version,
      is_verified,
      auth_provider
    ) VALUES (
      ${overrides.username},
      ${overrides.email ?? `${overrides.username}@example.com`},
      ${overrides.fullName ?? 'Session Test User'},
      ${overrides.gender ?? 'Other'},
      ${testPasswordHash},
      'User',
      ${overrides.isFirstLogin ?? false},
      0,
      ${overrides.isVerified ?? true},
      'app'
    )
    RETURNING id
  `;

  await sql`
    INSERT INTO public.user_reminder_settings (user_id)
    VALUES (${row.id}::uuid)
  `;

  return row.id;
}

export async function getUserSessionStateByUsername(username: string) {
  const [row] = await sql<{ id: string; token_version: string; push_token: string | null; last_login: Date | null }[]>`
    SELECT id, token_version::text, push_token, last_login
    FROM public.users
    WHERE username = ${username}
    LIMIT 1
  `;

  if (!row) return null;

  return {
    id: row.id,
    tokenVersion: Number(row.token_version),
    pushToken: row.push_token,
    lastLogin: row.last_login,
  };
}

export async function setUserPushTokenByUsername(username: string, pushToken: string) {
  await sql`
    UPDATE public.users
    SET push_token = ${pushToken}
    WHERE username = ${username}
  `;
}

export async function deleteUserByUsername(username: string) {
  await sql`
    DELETE FROM public.users
    WHERE username = ${username}
  `;
}

export async function getUserLastLoginByUsername(username: string) {
  const [row] = await sql<{ last_login: Date | null; database_now: Date }[]>`
    SELECT last_login, NOW() AS database_now
    FROM public.users
    WHERE username = ${username}
    LIMIT 1
  `;

  return {
    lastLogin: row?.last_login ?? null,
    databaseNow: row?.database_now ?? null,
  };
}

export async function getDatabaseNow() {
  const [row] = await sql<{ database_now: Date }[]>`
    SELECT NOW() AS database_now
  `;

  return row.database_now;
}

export async function waitForUserDeletionByUsername(username: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const row = await getUserAuthStateByUsername(username);

    if (!row) {
      return null;
    }

    if (attempt < 9) {
      await wait(25);
    }
  }

  return getUserAuthStateByUsername(username);
}

export async function hasReminderSettings(userId: string) {
  const [row] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count
    FROM public.user_reminder_settings
    WHERE user_id = ${userId}::uuid
  `;

  return Number(row?.count ?? '0') > 0;
}

export async function configureHourlyReminderForUser(userId: string, splitId: number, estimatedTimeUtc: string) {
  const preferredWeekday = new Date().getUTCDay();

  await sql`
    UPDATE public.user_reminder_settings
    SET workout_reminders_enabled = TRUE,
        reminder_offset_minutes = 0
    WHERE user_id = ${userId}::uuid
  `;

  await sql`
    INSERT INTO public.user_split_information (
      user_id,
      split_id,
      estimated_time_utc,
      confidence,
      preferred_weekday
    ) VALUES (
      ${userId}::uuid,
      ${splitId},
      ${estimatedTimeUtc}::timestamptz,
      1.00,
      ${preferredWeekday}
    )
    ON CONFLICT (user_id, split_id) DO UPDATE
    SET estimated_time_utc = EXCLUDED.estimated_time_utc,
        confidence = EXCLUDED.confidence,
        preferred_weekday = EXCLUDED.preferred_weekday
  `;
}
